/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    domains: [
      'github.com',
      'user-attachments-assets.githubusercontent.com',
      'user-images.githubusercontent.com',
      'raw.githubusercontent.com',
      'avatars.githubusercontent.com',
      'assets.github.com',
      'assets-cdn.github.com',
      'githubusercontent.com',
      'user-attachments',
      'user-attachments-assets',
      'user-attachments-assets.s3.amazonaws.com',
      'user-attachments-assets.s3.us-west-2.amazonaws.com',
      'user-attachments-assets.s3.amazonaws.com',
      'user-attachments-assets.s3.us-east-1.amazonaws.com',
      'user-attachments-assets.s3.eu-west-1.amazonaws.com',
      'user-attachments-assets.s3.ap-southeast-1.amazonaws.com',
      'user-attachments-assets.s3.ap-northeast-1.amazonaws.com',
      'user-attachments-assets.s3.ap-south-1.amazonaws.com',
      'user-attachments-assets.s3.ca-central-1.amazonaws.com',
      'user-attachments-assets.s3.sa-east-1.amazonaws.com',
    ],
  },
}

export default nextConfig
