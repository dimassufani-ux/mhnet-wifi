import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const CREDENTIALS_PATH = path.join(process.cwd(), 'google-credentials.json');

export async function getGoogleSheetClient() {
  // Try environment variable first (for Vercel/Railway)
  if (process.env.GOOGLE_CREDENTIALS) {
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    return google.sheets({ version: 'v4', auth });
  }

  // Try service account file (for local)
  if (fs.existsSync(CREDENTIALS_PATH)) {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    return google.sheets({ version: 'v4', auth });
  }

  // Fallback to Replit connector
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (xReplitToken && hostname) {
    const connectionSettings = await fetch(
      'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-sheet',
      { headers: { 'Accept': 'application/json', 'X_REPLIT_TOKEN': xReplitToken } }
    ).then(res => res.json()).then(data => data.items?.[0]);

    const accessToken = connectionSettings?.settings?.access_token;
    if (accessToken) {
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: accessToken });
      return google.sheets({ version: 'v4', auth: oauth2Client });
    }
  }

  throw new Error('Google Sheets credentials not found. Please setup google-credentials.json');
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
