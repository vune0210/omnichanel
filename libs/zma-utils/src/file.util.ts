import * as crypto from 'crypto';

import * as _ from 'lodash';

import { types } from './types';

const mimeTypeToExtensionMap: { [key: string]: string } = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'text/plain': 'txt',
  'text/html': 'html',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/zip': 'zip',
  'application/x-tar': 'tar',
  'application/x-gzip': 'gz',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'audio/mpeg': 'mp3',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/x-ms-wmv': 'wmv',
  'application/json': 'json',
  'application/javascript': 'js',
  'application/css': 'css',
};

export class FileUtils {
  static getMime = (name: string) => {
    const binaryoctet = 'binary/octet-stream';
    const value = types[name.substring(name.lastIndexOf('.')) as keyof typeof types];
    return value || { type: binaryoctet, name: 'Default' };
  };

  static mimeTypeToExtension(mimeType: string): string | null {
    return mimeTypeToExtensionMap[mimeType] || null;
  }

  static getFileExtension(fileName: string): string {
    const extension = _.toLower(fileName.split('.').pop());
    return extension || '';
  }

  static getMimeTypeFromFileName(fileName: string): { type: string; name: string } {
    return this.getMime(fileName);
  }

  static getMimeTypeFromBuffer(buffer: Buffer): { type: string; name: string; extension: string } {
    const extension = this.detectExtension(buffer).toLowerCase();
    return { ...this.getMimeTypeFromFileName(`default.${extension}`), extension };
  }

  static hashFileContent(buffer: Buffer, algorithm = 'sha256'): string {
    const hash = crypto.createHash(algorithm);
    hash.update(buffer);
    return hash.digest('hex');
  }

  static compareExtensions(ext1: string, ext2: string): boolean {
    if (!ext1 || !ext2) return false;

    // Normalize extensions by removing dots and converting to lowercase
    const normalize = (ext: string) =>
      ext.startsWith('.') ? ext.slice(1).toLowerCase() : ext.toLowerCase();

    const normalizedExt1 = normalize(ext1);
    const normalizedExt2 = normalize(ext2);

    // Direct match
    if (normalizedExt1 === normalizedExt2) return true;

    // Handle known equivalents
    const equivalents: { [key: string]: string[] } = {
      jpg: ['jpg', 'jpeg', 'jpe', 'jfif'],
      jpeg: ['jpg', 'jpeg', 'jpe', 'jfif'],
      tif: ['tif', 'tiff'],
      tiff: ['tif', 'tiff'],
      htm: ['htm', 'html'],
      html: ['htm', 'html'],
      mp4: ['mp4', 'm4v'],
      m4v: ['mp4', 'm4v'],
      mov: ['mov', 'qt'],
      qt: ['mov', 'qt'],
      doc: ['doc', 'docx'],
      docx: ['doc', 'docx'],
      xls: ['xls', 'xlsx'],
      xlsx: ['xls', 'xlsx'],
      ppt: ['ppt', 'pptx'],
      pptx: ['ppt', 'pptx'],
    };

    // Check if either extension is in the equivalents map
    if (equivalents[normalizedExt1]?.includes(normalizedExt2)) return true;
    if (equivalents[normalizedExt2]?.includes(normalizedExt1)) return true;

    return false;
  }

  static detectExtension(buffer: Buffer): string {
    if (!buffer || !Buffer.isBuffer(buffer) || buffer.length < 8) {
      return 'Unknown';
    }
    const hash = crypto.createHash('md5');
    hash.update(buffer.subarray(0, 262)); // Use first 262 bytes for signature

    const fileSignature = hash.digest('hex');
    const firstFourBytes = buffer.subarray(0, 4).toString('hex');
    const firstEightBytes = buffer.subarray(0, 8).toString('hex');
    return this.identifyFileType(fileSignature, firstFourBytes, firstEightBytes, buffer);
  }

  static buildImageUrl(baseUrl: string, imagePath: string): string {
    if (!imagePath || !baseUrl) return imagePath || '';

    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

    return `${cleanBaseUrl}/${cleanPath}`;
  }

  /*
  DO NOT CHANGE THE ORDER OF THE SIGNATURES
  */
  private static identifyFileType(
    signature: string,
    firstFourBytes: string,
    firstEightBytes: string,
    buffer: Buffer,
  ): string {
    const signatures: { [key: string]: string } = {
      '89504e470d0a1a0a': 'PNG', //  pragma: allowlist secret
      ffd8ffe000104a46: 'JPEG', //  pragma: allowlist secret
      ffd8ffe1: 'JPEG', //  pragma: allowlist secret - JPEG with EXIF data
      ffd8ffdb: 'JPEG', //  pragma: allowlist secret - JPEG with quantization table
      ffd8ffee: 'JPEG', //  pragma: allowlist secret - JPEG with JFIF marker
      '504b0304': 'ZIP', //  pragma: allowlist secret
      '47494638': 'GIF', //  pragma: allowlist secret
      '47494638397a': 'GIF', //  pragma: allowlist secret - GIF87a
      '47494638396a': 'GIF', //  pragma: allowlist secret - GIF89a
      '424d': 'BMP', //  pragma: allowlist secret
      '4D5A': 'EXE', //  pragma: allowlist secret
      '25504446': 'PDF', //  pragma: allowlist secret
      d0cf11e0a1b11ae1: 'DOC', //  pragma: allowlist secret
      '52494646': 'WEBP', //  pragma: allowlist secret - WEBP/RIFF header
      '00000100': 'ICO', //  pragma: allowlist secret - ICO header
      '49492a00': 'TIFF', //  pragma: allowlist secret - TIFF (little endian)
      '4d4d002a': 'TIFF', //  pragma: allowlist secret - TIFF (big endian)
      '38425053': 'PSD', //  pragma: allowlist secret - Photoshop document
      fffd8ffe: 'JPEG', //  pragma: allowlist secret - JPEG 2000
      '464f524d': 'AIFF', //  pragma: allowlist secret - AIFF image format
    };

    if (firstEightBytes === '504b030414000600' && buffer.includes('word/')) {
      return 'DOCX';
    }

    if (signatures[firstFourBytes]) {
      return signatures[firstFourBytes];
    }

    if (signatures[firstEightBytes]) {
      return signatures[firstEightBytes];
    }

    for (const [key, value] of Object.entries(signatures)) {
      if (signature.startsWith(key)) {
        return value;
      }
    }

    return 'Unknown';
  }
}
