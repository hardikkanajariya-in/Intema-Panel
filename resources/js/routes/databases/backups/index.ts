import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ManagedDatabaseController::download
 * @see app/Http/Controllers/ManagedDatabaseController.php:71
 * @route '/databases/{database}/backups/{backup}/download'
 */
export const download = (args: { database: string | { uuid: string }, backup: string | { uuid: string } } | [database: string | { uuid: string }, backup: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/databases/{database}/backups/{backup}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ManagedDatabaseController::download
 * @see app/Http/Controllers/ManagedDatabaseController.php:71
 * @route '/databases/{database}/backups/{backup}/download'
 */
download.url = (args: { database: string | { uuid: string }, backup: string | { uuid: string } } | [database: string | { uuid: string }, backup: string | { uuid: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    database: args[0],
                    backup: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        database: typeof args.database === 'object'
                ? args.database.uuid
                : args.database,
                                backup: typeof args.backup === 'object'
                ? args.backup.uuid
                : args.backup,
                }

    return download.definition.url
            .replace('{database}', parsedArgs.database.toString())
            .replace('{backup}', parsedArgs.backup.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ManagedDatabaseController::download
 * @see app/Http/Controllers/ManagedDatabaseController.php:71
 * @route '/databases/{database}/backups/{backup}/download'
 */
download.get = (args: { database: string | { uuid: string }, backup: string | { uuid: string } } | [database: string | { uuid: string }, backup: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ManagedDatabaseController::download
 * @see app/Http/Controllers/ManagedDatabaseController.php:71
 * @route '/databases/{database}/backups/{backup}/download'
 */
download.head = (args: { database: string | { uuid: string }, backup: string | { uuid: string } } | [database: string | { uuid: string }, backup: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ManagedDatabaseController::download
 * @see app/Http/Controllers/ManagedDatabaseController.php:71
 * @route '/databases/{database}/backups/{backup}/download'
 */
    const downloadForm = (args: { database: string | { uuid: string }, backup: string | { uuid: string } } | [database: string | { uuid: string }, backup: string | { uuid: string } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ManagedDatabaseController::download
 * @see app/Http/Controllers/ManagedDatabaseController.php:71
 * @route '/databases/{database}/backups/{backup}/download'
 */
        downloadForm.get = (args: { database: string | { uuid: string }, backup: string | { uuid: string } } | [database: string | { uuid: string }, backup: string | { uuid: string } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ManagedDatabaseController::download
 * @see app/Http/Controllers/ManagedDatabaseController.php:71
 * @route '/databases/{database}/backups/{backup}/download'
 */
        downloadForm.head = (args: { database: string | { uuid: string }, backup: string | { uuid: string } } | [database: string | { uuid: string }, backup: string | { uuid: string } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    download.form = downloadForm
/**
* @see \App\Http\Controllers\ManagedDatabaseController::restore
 * @see app/Http/Controllers/ManagedDatabaseController.php:133
 * @route '/databases/{database}/backups/{backup}/restore'
 */
export const restore = (args: { database: string | { uuid: string }, backup: string | { uuid: string } } | [database: string | { uuid: string }, backup: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restore.url(args, options),
    method: 'post',
})

restore.definition = {
    methods: ["post"],
    url: '/databases/{database}/backups/{backup}/restore',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ManagedDatabaseController::restore
 * @see app/Http/Controllers/ManagedDatabaseController.php:133
 * @route '/databases/{database}/backups/{backup}/restore'
 */
restore.url = (args: { database: string | { uuid: string }, backup: string | { uuid: string } } | [database: string | { uuid: string }, backup: string | { uuid: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    database: args[0],
                    backup: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        database: typeof args.database === 'object'
                ? args.database.uuid
                : args.database,
                                backup: typeof args.backup === 'object'
                ? args.backup.uuid
                : args.backup,
                }

    return restore.definition.url
            .replace('{database}', parsedArgs.database.toString())
            .replace('{backup}', parsedArgs.backup.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ManagedDatabaseController::restore
 * @see app/Http/Controllers/ManagedDatabaseController.php:133
 * @route '/databases/{database}/backups/{backup}/restore'
 */
restore.post = (args: { database: string | { uuid: string }, backup: string | { uuid: string } } | [database: string | { uuid: string }, backup: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restore.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ManagedDatabaseController::restore
 * @see app/Http/Controllers/ManagedDatabaseController.php:133
 * @route '/databases/{database}/backups/{backup}/restore'
 */
    const restoreForm = (args: { database: string | { uuid: string }, backup: string | { uuid: string } } | [database: string | { uuid: string }, backup: string | { uuid: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: restore.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ManagedDatabaseController::restore
 * @see app/Http/Controllers/ManagedDatabaseController.php:133
 * @route '/databases/{database}/backups/{backup}/restore'
 */
        restoreForm.post = (args: { database: string | { uuid: string }, backup: string | { uuid: string } } | [database: string | { uuid: string }, backup: string | { uuid: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: restore.url(args, options),
            method: 'post',
        })
    
    restore.form = restoreForm
const backups = {
    download: Object.assign(download, download),
restore: Object.assign(restore, restore),
}

export default backups