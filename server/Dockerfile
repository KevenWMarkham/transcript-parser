FROM node:20-alpine

WORKDIR /app

# Install FFmpeg
RUN apk add --no-cache ffmpeg

# Create simple package.json for audio extraction server
RUN echo '{"name":"audio-server","version":"1.0.0","dependencies":{"express":"^4.18.2","cors":"^2.8.5","multer":"^1.4.5-lts.1"}}' > package.json

# Install dependencies
RUN npm install --omit=dev

# Copy the simple audio extraction server
COPY index.js ./

# Create uploads directory
RUN mkdir -p /tmp/uploads

# Expose port
EXPOSE 3001

# Run the server
CMD ["node", "index.js"]
