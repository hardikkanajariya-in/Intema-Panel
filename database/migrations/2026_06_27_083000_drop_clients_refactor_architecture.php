<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('clients');

        Schema::table('activity_logs', function (Blueprint $table) {
            $table->uuid('uuid')->nullable()->after('id');
            $table->softDeletes();
            $table->foreignId('created_by')->nullable()->after('properties')->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->after('created_by')->constrained('users')->nullOnDelete();
            $table->timestamp('updated_at')->nullable()->after('created_at');
        });

        Schema::table('settings', function (Blueprint $table) {
            $table->uuid('uuid')->nullable()->after('id');
            $table->string('status')->default('active')->after('value');
            $table->softDeletes();
            $table->foreignId('created_by')->nullable()->after('status')->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->after('created_by')->constrained('users')->nullOnDelete();
        });

        Schema::table('domains', function (Blueprint $table) {
            $table->foreign('ssl_certificate_id')
                ->references('id')
                ->on('ssl_certificates')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('domains', function (Blueprint $table) {
            $table->dropForeign(['ssl_certificate_id']);
        });

        Schema::table('settings', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropForeign(['updated_by']);
            $table->dropColumn(['uuid', 'status', 'deleted_at', 'created_by', 'updated_by']);
        });

        Schema::table('activity_logs', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropForeign(['updated_by']);
            $table->dropColumn(['uuid', 'deleted_at', 'created_by', 'updated_by', 'updated_at']);
        });

        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('company_name');
            $table->string('domain')->unique();
            $table->string('database_name')->nullable();
            $table->string('database_user')->nullable();
            $table->text('database_password_encrypted')->nullable();
            $table->string('status')->default('active');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }
};
