<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('domains', function (Blueprint $table) {
            try {
                $table->dropForeign(['ssl_certificate_id']);
            } catch (\Throwable $e) {}

            if (Schema::hasColumn('domains', 'ssl_certificate_id')) {
                $table->dropColumn('ssl_certificate_id');
            }
            $table->boolean('ssl_active')->default(false)->after('document_root');
        });

        Schema::dropIfExists('ssl_certificates');
    }

    public function down(): void
    {
        Schema::table('domains', function (Blueprint $table) {
            $table->unsignedBigInteger('ssl_certificate_id')->nullable()->after('document_root');
            $table->dropColumn('ssl_active');
        });

        Schema::create('ssl_certificates', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('project_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedBigInteger('domain_id')->nullable();
            $table->string('domain_name');
            $table->string('issuer')->nullable();
            $table->boolean('auto_renew')->default(true);
            $table->string('status')->default('pending');
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }
};
