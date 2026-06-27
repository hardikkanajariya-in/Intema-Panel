import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
} from './../../wayfinder';
/**
 * @see \App\Http\Controllers\ManagedDatabaseController::index
 * @see app/Http/Controllers/ManagedDatabaseController.php:20
 * @route '/databases'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/databases',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ManagedDatabaseController::index
 * @see app/Http/Controllers/ManagedDatabaseController.php:20
 * @route '/databases'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ManagedDatabaseController::index
 * @see app/Http/Controllers/ManagedDatabaseController.php:20
 * @route '/databases'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\ManagedDatabaseController::index
 * @see app/Http/Controllers/ManagedDatabaseController.php:20
 * @route '/databases'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ManagedDatabaseController::index
 * @see app/Http/Controllers/ManagedDatabaseController.php:20
 * @route '/databases'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ManagedDatabaseController::index
 * @see app/Http/Controllers/ManagedDatabaseController.php:20
 * @route '/databases'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\ManagedDatabaseController::index
 * @see app/Http/Controllers/ManagedDatabaseController.php:20
 * @route '/databases'
 */
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

index.form = indexForm;
/**
 * @see \App\Http\Controllers\ManagedDatabaseController::show
 * @see app/Http/Controllers/ManagedDatabaseController.php:43
 * @route '/databases/{database}'
 */
export const show = (
    args:
        | { database: string | { uuid: string } }
        | [database: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

show.definition = {
    methods: ['get', 'head'],
    url: '/databases/{database}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ManagedDatabaseController::show
 * @see app/Http/Controllers/ManagedDatabaseController.php:43
 * @route '/databases/{database}'
 */
show.url = (
    args:
        | { database: string | { uuid: string } }
        | [database: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { database: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { database: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            database: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        database:
            typeof args.database === 'object'
                ? args.database.uuid
                : args.database,
    };

    return (
        show.definition.url
            .replace('{database}', parsedArgs.database.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ManagedDatabaseController::show
 * @see app/Http/Controllers/ManagedDatabaseController.php:43
 * @route '/databases/{database}'
 */
show.get = (
    args:
        | { database: string | { uuid: string } }
        | [database: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\ManagedDatabaseController::show
 * @see app/Http/Controllers/ManagedDatabaseController.php:43
 * @route '/databases/{database}'
 */
show.head = (
    args:
        | { database: string | { uuid: string } }
        | [database: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ManagedDatabaseController::show
 * @see app/Http/Controllers/ManagedDatabaseController.php:43
 * @route '/databases/{database}'
 */
const showForm = (
    args:
        | { database: string | { uuid: string } }
        | [database: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ManagedDatabaseController::show
 * @see app/Http/Controllers/ManagedDatabaseController.php:43
 * @route '/databases/{database}'
 */
showForm.get = (
    args:
        | { database: string | { uuid: string } }
        | [database: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\ManagedDatabaseController::show
 * @see app/Http/Controllers/ManagedDatabaseController.php:43
 * @route '/databases/{database}'
 */
showForm.head = (
    args:
        | { database: string | { uuid: string } }
        | [database: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

show.form = showForm;
/**
 * @see \App\Http\Controllers\ManagedDatabaseController::destroy
 * @see app/Http/Controllers/ManagedDatabaseController.php:73
 * @route '/databases/{database}'
 */
export const destroy = (
    args:
        | { database: string | { uuid: string } }
        | [database: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/databases/{database}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\ManagedDatabaseController::destroy
 * @see app/Http/Controllers/ManagedDatabaseController.php:73
 * @route '/databases/{database}'
 */
destroy.url = (
    args:
        | { database: string | { uuid: string } }
        | [database: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { database: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { database: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            database: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        database:
            typeof args.database === 'object'
                ? args.database.uuid
                : args.database,
    };

    return (
        destroy.definition.url
            .replace('{database}', parsedArgs.database.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ManagedDatabaseController::destroy
 * @see app/Http/Controllers/ManagedDatabaseController.php:73
 * @route '/databases/{database}'
 */
destroy.delete = (
    args:
        | { database: string | { uuid: string } }
        | [database: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\ManagedDatabaseController::destroy
 * @see app/Http/Controllers/ManagedDatabaseController.php:73
 * @route '/databases/{database}'
 */
const destroyForm = (
    args:
        | { database: string | { uuid: string } }
        | [database: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ManagedDatabaseController::destroy
 * @see app/Http/Controllers/ManagedDatabaseController.php:73
 * @route '/databases/{database}'
 */
destroyForm.delete = (
    args:
        | { database: string | { uuid: string } }
        | [database: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

destroy.form = destroyForm;
/**
 * @see \App\Http\Controllers\ManagedDatabaseController::backup
 * @see app/Http/Controllers/ManagedDatabaseController.php:54
 * @route '/databases/{database}/backup'
 */
export const backup = (
    args:
        | { database: string | { uuid: string } }
        | [database: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: backup.url(args, options),
    method: 'post',
});

backup.definition = {
    methods: ['post'],
    url: '/databases/{database}/backup',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\ManagedDatabaseController::backup
 * @see app/Http/Controllers/ManagedDatabaseController.php:54
 * @route '/databases/{database}/backup'
 */
backup.url = (
    args:
        | { database: string | { uuid: string } }
        | [database: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { database: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { database: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            database: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        database:
            typeof args.database === 'object'
                ? args.database.uuid
                : args.database,
    };

    return (
        backup.definition.url
            .replace('{database}', parsedArgs.database.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ManagedDatabaseController::backup
 * @see app/Http/Controllers/ManagedDatabaseController.php:54
 * @route '/databases/{database}/backup'
 */
backup.post = (
    args:
        | { database: string | { uuid: string } }
        | [database: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: backup.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ManagedDatabaseController::backup
 * @see app/Http/Controllers/ManagedDatabaseController.php:54
 * @route '/databases/{database}/backup'
 */
const backupForm = (
    args:
        | { database: string | { uuid: string } }
        | [database: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: backup.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ManagedDatabaseController::backup
 * @see app/Http/Controllers/ManagedDatabaseController.php:54
 * @route '/databases/{database}/backup'
 */
backupForm.post = (
    args:
        | { database: string | { uuid: string } }
        | [database: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: backup.url(args, options),
    method: 'post',
});

backup.form = backupForm;
/**
 * @see \App\Http\Controllers\ManagedDatabaseController::resetPassword
 * @see app/Http/Controllers/ManagedDatabaseController.php:63
 * @route '/databases/{database}/reset-password'
 */
export const resetPassword = (
    args:
        | { database: string | { uuid: string } }
        | [database: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: resetPassword.url(args, options),
    method: 'post',
});

resetPassword.definition = {
    methods: ['post'],
    url: '/databases/{database}/reset-password',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\ManagedDatabaseController::resetPassword
 * @see app/Http/Controllers/ManagedDatabaseController.php:63
 * @route '/databases/{database}/reset-password'
 */
resetPassword.url = (
    args:
        | { database: string | { uuid: string } }
        | [database: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { database: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { database: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            database: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        database:
            typeof args.database === 'object'
                ? args.database.uuid
                : args.database,
    };

    return (
        resetPassword.definition.url
            .replace('{database}', parsedArgs.database.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ManagedDatabaseController::resetPassword
 * @see app/Http/Controllers/ManagedDatabaseController.php:63
 * @route '/databases/{database}/reset-password'
 */
resetPassword.post = (
    args:
        | { database: string | { uuid: string } }
        | [database: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: resetPassword.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ManagedDatabaseController::resetPassword
 * @see app/Http/Controllers/ManagedDatabaseController.php:63
 * @route '/databases/{database}/reset-password'
 */
const resetPasswordForm = (
    args:
        | { database: string | { uuid: string } }
        | [database: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: resetPassword.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ManagedDatabaseController::resetPassword
 * @see app/Http/Controllers/ManagedDatabaseController.php:63
 * @route '/databases/{database}/reset-password'
 */
resetPasswordForm.post = (
    args:
        | { database: string | { uuid: string } }
        | [database: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: resetPassword.url(args, options),
    method: 'post',
});

resetPassword.form = resetPasswordForm;
const databases = {
    index: Object.assign(index, index),
    show: Object.assign(show, show),
    destroy: Object.assign(destroy, destroy),
    backup: Object.assign(backup, backup),
    resetPassword: Object.assign(resetPassword, resetPassword),
};

export default databases;
