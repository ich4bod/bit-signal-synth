FROM alpine:3.20
ARG OCI_REVISION
ARG OCI_CREATED
LABEL org.opencontainers.image.revision=$OCI_REVISION \
      org.opencontainers.image.created=$OCI_CREATED
RUN apk add --no-cache busybox-extras && adduser -D -H app
WORKDIR /srv
COPY --chown=app:app . .
USER app
EXPOSE 3000
CMD ["httpd", "-f", "-p", "3000", "-h", "/srv"]
