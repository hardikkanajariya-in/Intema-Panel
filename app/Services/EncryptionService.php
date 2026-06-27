<?php

namespace App\Services;

use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Contracts\Encryption\Encrypter;
use Illuminate\Support\Str;

class EncryptionService
{
    public function __construct(
        private readonly Encrypter $encrypter,
    ) {}

    public function encrypt(?string $value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        return $this->encrypter->encryptString($value);
    }

    public function decrypt(?string $value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        try {
            return $this->encrypter->decryptString($value);
        } catch (DecryptException) {
            return null;
        }
    }

    public function generatePassword(int $length = 24): string
    {
        return Str::password($length, symbols: true);
    }
}
