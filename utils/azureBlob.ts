import { BlobServiceClient } from '@azure/storage-blob';

const containerName = 'aspencompany';

let blobServiceClient: BlobServiceClient | null = null;

/**
 * Lazily create BlobServiceClient (runtime only)
 */
function getContainerClient() {
  if (!blobServiceClient) {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

    if (!connectionString) {
      throw new Error('AZURE_STORAGE_CONNECTION_STRING is missing');
    }

    blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
  }

  return blobServiceClient.getContainerClient(containerName);
}
/**
 * Upload image to Azure Blob Storage
 */
export const uploadAttachment = async (file: File) => {

  const containerClient = getContainerClient(); 
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
  const containerClient = getContainerClient(); 
  const blobName = url.split('/').pop();
  if (!blobName) throw new Error('Invalid URL');

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.deleteIfExists();
};
