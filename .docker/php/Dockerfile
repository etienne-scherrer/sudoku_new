FROM php:8.5-fpm-alpine

RUN apk add --no-cache \
    tesseract-ocr \
    tesseract-ocr-data-eng \
    freetype-dev \
    libjpeg-turbo-dev \
    libpng-dev \
    libwebp-dev

RUN docker-php-ext-configure gd \
        --with-freetype \
        --with-jpeg \
        --with-webp \
    && docker-php-ext-install gd

RUN echo "upload_max_filesize = 5M" > /usr/local/etc/php/conf.d/uploads.ini \
    && echo "post_max_size = 6M" >> /usr/local/etc/php/conf.d/uploads.ini

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY api/ /var/www/api/
WORKDIR /var/www/api
RUN composer install --no-dev --optimize-autoloader

EXPOSE 9000
