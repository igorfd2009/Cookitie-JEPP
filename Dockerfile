FROM ghcr.io/pocketbase/pocketbase:latest

# Exponha a porta interna do PocketBase
EXPOSE 8090

# Volume para persistência (no Railway, monte em /data)
VOLUME ["/data"]

# Servir ouvindo na porta atribuída pelo Railway (PORT) ou 8090 por padrão
# Usa /data como diretório de dados para persistência
CMD ["sh", "-c", "exec pocketbase serve --http=0.0.0.0:${PORT:-8090} --dir /data"]


