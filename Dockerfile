FROM alpine:3.19

# Install ca-certificates
RUN apk --no-cache add ca-certificates wget unzip

# Set workdir
WORKDIR /pb

# Download PocketBase (use specific version that works)
ADD https://github.com/pocketbase/pocketbase/releases/download/v0.22.0/pocketbase_0.22.0_linux_amd64.zip /tmp/pb.zip

# Extract and cleanup
RUN unzip /tmp/pb.zip -d /pb && \
    rm /tmp/pb.zip && \
    chmod +x /pb/pocketbase

# Expose port
EXPOSE 8090

# Start PocketBase
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb_data"]