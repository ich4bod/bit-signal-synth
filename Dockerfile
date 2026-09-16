FROM alpine:3.20
RUN adduser -D -H app
WORKDIR /srv
COPY --chown=app:app . .
USER app
EXPOSE 3000
CMD ["busybox", "httpd", "-f", "-p", "3000", "-h", "/srv"]
