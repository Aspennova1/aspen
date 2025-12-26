import { BlobServiceClient } from '@azure/storage-blob';

const containerName = 'aspencompany';

// Azure credentials
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING as string;

if (!connectionString) {
  throw new Error('Missing AZURE_STORAGE_CONNECTION_STRING');
}

const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString);

const containerClient =
  blobServiceClient.getContainerClient(containerName);

/**
 * Upload image to Azure Blob Storage
 */
export const uploadAttachment = async (file: File) => {

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  const timestamp = Date.now();
  const safeFileName = file.name.replace(/\s+/g, '_');
  const newName = `${timestamp}-${safeFileName}`;

  const blockBlobClient =
    containerClient.getBlockBlobClient(newName);

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: file.type,
      blobCacheControl: 'public, max-age=3600',
    },
  });

  return blockBlobClient.url;
};

/**
 * Delete image from Azure Blob Storage
 */
export const deleteAttachment = async (url: string) => {
  const blobName = url.split('/').pop();
  if (!blobName) throw new Error('Invalid URL');

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.deleteIfExists();
};
