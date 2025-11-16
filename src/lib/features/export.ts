import { ExportOptions, ExportData } from '../../types/features';

// ============================================================
// EXPORT TO JSON
// ============================================================

export const exportChatsAsJSON = async (
  chats: any[],
  options: ExportOptions
): Promise<ExportData> => {
  const data = chats.map((chat) => {
    const exportItem: any = {
      id: chat.id,
      title: chat.title,
      created_at: chat.created_at,
      updated_at: chat.updated_at,
    };

    if (options.includeMetadata) {
      exportItem.model = chat.model;
      exportItem.total_tokens = chat.total_tokens;
      exportItem.total_messages = chat.total_messages;
    }

    exportItem.messages = chat.messages || [];
    return exportItem;
  });

  return {
    format: 'json',
    data,
    filename: `chats_export_${new Date().toISOString().split('T')[0]}.json`,
  };
};

// ============================================================
// EXPORT TO CSV
// ============================================================

export const exportChatsAsCSV = async (
  chats: any[],
  options: ExportOptions
): Promise<ExportData> => {
  const headers = ['Chat ID', 'Title', 'Created At', 'Message Count'];

  if (options.includeMetadata) {
    headers.push('Model', 'Total Tokens', 'Last Updated');
  }

  const rows = chats.map((chat) => {
    const row = [chat.id, chat.title || 'Untitled', chat.created_at, chat.total_messages || 0];

    if (options.includeMetadata) {
      row.push(chat.model || '-', chat.total_tokens || 0, chat.updated_at || '-');
    }

    return row;
  });

  const csvContent = [
    headers.map((h) => `"${h}"`).join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  return {
    format: 'csv',
    data: csvContent,
    filename: `chats_export_${new Date().toISOString().split('T')[0]}.csv`,
  };
};

// ============================================================
// EXPORT TO MARKDOWN
// ============================================================

export const exportChatsAsMarkdown = async (
  chats: any[],
  options: ExportOptions
): Promise<ExportData> => {
  const lines: string[] = [];

  lines.push('# Chat Export');
  lines.push(`Generated: ${new Date().toLocaleString()}`);
  lines.push(`Total Chats: ${chats.length}`);
  lines.push('');

  for (const chat of chats) {
    lines.push(`## ${chat.title || 'Untitled Chat'}`);
    lines.push(`**Created:** ${new Date(chat.created_at).toLocaleString()}`);

    if (options.includeMetadata) {
      lines.push(`**Model:** ${chat.model || 'Unknown'}`);
      lines.push(`**Messages:** ${chat.total_messages || 0}`);
      lines.push(`**Tokens:** ${chat.total_tokens || 0}`);
    }

    lines.push('');

    if (chat.messages && Array.isArray(chat.messages)) {
      for (const message of chat.messages) {
        const role = message.role || 'Unknown';
        const content = message.content || '';

        lines.push(`### ${role.charAt(0).toUpperCase() + role.slice(1)}`);
        lines.push(content);
        lines.push('');
      }
    }

    lines.push('---');
    lines.push('');
  }

  return {
    format: 'markdown',
    data: lines.join('\n'),
    filename: `chats_export_${new Date().toISOString().split('T')[0]}.md`,
  };
};

// ============================================================
// BATCH EXPORT
// ============================================================

export const batchExportChats = async (
  chats: any[],
  formats: ExportOptions['format'][],
  options: ExportOptions
): Promise<ExportData[]> => {
  const results: ExportData[] = [];

  for (const format of formats) {
    const exportOptions = { ...options, format };

    switch (format) {
      case 'json':
        results.push(await exportChatsAsJSON(chats, exportOptions));
        break;
      case 'csv':
        results.push(await exportChatsAsCSV(chats, exportOptions));
        break;
      case 'markdown':
        results.push(await exportChatsAsMarkdown(chats, exportOptions));
        break;
    }
  }

  return results;
};

// ============================================================
// DOWNLOAD HELPERS
// ============================================================

export const downloadExportedData = (data: ExportData): void => {
  let content = '';
  let mimeType = 'text/plain';

  if (typeof data.data === 'string') {
    content = data.data;
    mimeType = data.format === 'json' ? 'application/json' : 'text/plain';
  } else {
    content = JSON.stringify(data.data, null, 2);
    mimeType = 'application/json';
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = data.filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const copyExportedDataToClipboard = async (data: ExportData): Promise<void> => {
  const content = typeof data.data === 'string' ? data.data : JSON.stringify(data.data, null, 2);

  try {
    await navigator.clipboard.writeText(content);
  } catch (error) {
    throw new Error('Failed to copy to clipboard');
  }
};

// ============================================================
// IMPORT HELPERS
// ============================================================

export const parseImportedJSON = (jsonContent: string): any[] => {
  try {
    const data = JSON.parse(jsonContent);
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
};

export const parseImportedCSV = (csvContent: string): Record<string, any>[] => {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV must have at least header and one data row');
  }

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  const rows: Record<string, any>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cells = parseCSVLine(lines[i]);
    const row: Record<string, any> = {};

    headers.forEach((header, index) => {
      row[header] = cells[index] || '';
    });

    rows.push(row);
  }

  return rows;
};

function parseCSVLine(line: string): string[] {
  const cells: string[] = [];
  let currentCell = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // Skip next quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      cells.push(currentCell.trim());
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  cells.push(currentCell.trim());
  return cells;
}

// ============================================================
// COMPRESSION (for large exports)
// ============================================================

export const compressExportedData = async (data: ExportData): Promise<Blob> => {
  const content = typeof data.data === 'string' ? data.data : JSON.stringify(data.data, null, 2);

  // Use CompressionStream if available (modern browsers)
  if ('CompressionStream' in window) {
    const stream = new (window as any).CompressionStream('gzip');
    const writer = stream.writable.getWriter();
    writer.write(new TextEncoder().encode(content));
    writer.close();

    const reader = stream.readable.getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    return new Blob(chunks, { type: 'application/gzip' });
  }

  // Fallback: return uncompressed blob
  return new Blob([content], { type: 'application/octet-stream' });
};
