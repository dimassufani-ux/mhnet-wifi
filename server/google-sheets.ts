import { google } from 'googleapis';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-sheet',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Google Sheet not connected');
  }
  return accessToken;
}

export async function getGoogleSheetClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.sheets({ version: 'v4', auth: oauth2Client });
}

export async function readSheet(spreadsheetId: string, range: string) {
  const sheets = await getGoogleSheetClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  return response.data.values || [];
}

export async function writeSheet(spreadsheetId: string, range: string, values: any[][]) {
  const sheets = await getGoogleSheetClient();
  const response = await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values,
    },
  });
  return response.data;
}

export async function appendSheet(spreadsheetId: string, range: string, values: any[][]) {
  const sheets = await getGoogleSheetClient();
  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values,
    },
  });
  return response.data;
}

export async function createSpreadsheet(title: string, sheetNames: string[]) {
  const sheetsClient = await getGoogleSheetClient();
  const response = await sheetsClient.spreadsheets.create({
    requestBody: {
      properties: {
        title,
      },
      sheets: sheetNames.map(sheetName => ({
        properties: {
          title: sheetName,
        },
      })),
    },
  });
  return response.data;
}

export async function getSpreadsheetInfo(spreadsheetId: string) {
  const sheets = await getGoogleSheetClient();
  const response = await sheets.spreadsheets.get({
    spreadsheetId,
  });
  return response.data;
}

export async function clearRange(spreadsheetId: string, range: string) {
  const sheets = await getGoogleSheetClient();
  const response = await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range,
  });
  return response.data;
}

export async function deleteRows(spreadsheetId: string, sheetName: string, startRowIndex: number, endRowIndex: number) {
  const sheets = await getGoogleSheetClient();
  const spreadsheet = await getSpreadsheetInfo(spreadsheetId);
  const sheet = spreadsheet.sheets?.find(s => s.properties?.title === sheetName);
  
  if (!sheet || !sheet.properties?.sheetId) {
    throw new Error(`Sheet "${sheetName}" not found`);
  }

  const response = await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [{
        deleteDimension: {
          range: {
            sheetId: sheet.properties.sheetId,
            dimension: 'ROWS',
            startIndex: startRowIndex,
            endIndex: endRowIndex,
          },
        },
      }],
    },
  });
  
  return response.data;
}
