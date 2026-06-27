<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('project_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('type');
            $table->string('status')->default('pending');
            $table->string('root_path')->nullable();
            $table->string('repository_url')->nullable();
            $table->string('repository_branch')->default('main');
            $table->string('deploy_path')->nullable();
            $table->string('runtime')->nullable();
            $table->string('build_command')->nullable();
            $table->string('start_command')->nullable();
            $table->json('environment_variables')->nullable();
            $table->string('linux_user')->nullable();
            $table->json('metadata')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
