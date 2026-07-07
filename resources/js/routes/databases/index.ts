import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import backups from './backups'
/**
* @see \App\Http\Controllers\ManagedDatabaseController::index
 * @see app/Http/Controllers/ManagedDatabaseController.php:27
 * @route '/databases'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/databases',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ManagedDatabaseController::index
 * @see app/Http/Controllers/ManagedDatabaseController.php:27
 * @route '/databases'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ManagedDatabaseController::index
 * @see app/Http/Controllers/ManagedDatabaseController.php:27
 * @route '/databases'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ManagedDatabaseController::index
 * @see app/Http/Controllers/ManagedDatabaseController.php:27
 * @route '/databases'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ManagedDatabaseController::index
 * @see app/Http/Controllers/ManagedDatabaseController.php:27
 * @route '/databases'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ManagedDatabaseController::index
 * @see app/Http/Controllers/ManagedDatabaseController.php:27
 * @route '/databases'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ManagedDatabaseController::index
 * @see app/Http/Controllers/ManagedDatabaseController.php:27
 * @route '/databases'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\ManagedDatabaseController::create
 * @see app/Http/Controllers/ManagedDatabaseController.php:183
 * @route '/databases/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/databases/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ManagedDatabaseController::create
 * @see app/Http/Controllers/ManagedDatabaseController.php:183
 * @route '/databases/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ManagedDatabaseController::create
 * @see app/Http/Controllers/ManagedDatabaseController.php:183
 * @route '/databases/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ManagedDatabaseController::create
 * @see app/Http/Controllers/ManagedDatabaseController.php:183
 * @route '/databases/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ManagedDatabaseController::create
 * @see app/Http/Controllers/ManagedDatabaseController.php:183
 * @route '/databases/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ManagedDatabaseController::create
 * @see app/Http/Controllers/ManagedDatabaseController.php:183
 * @route '/databases/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ManagedDatabaseController::create
 * @see app/Http/Controllers/ManagedDatabaseController.php:183
 * @route '/databases/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\ManagedDatabaseController::store
 * @see app/Http/Controllers/ManagedDatabaseController.php:207
 * @route '/databases'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/databases',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ManagedDatabaseController::store
 * @see app/Http/Controllers/ManagedDatabaseController.php:207
 * @route '/databases'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ManagedDatabaseController::store
 * @see app/Http/Controllers/ManagedDatabaseController.php:207
 * @route '/databases'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ManagedDatabaseController::store
 * @see app/Http/Controllers/ManagedDatabaseController.php:207
 * @route '/databases'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ManagedDatabaseController::store
 * @see app/Http/Controllers/ManagedDatabaseController.php:207
 * @route '/databases'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ManagedDatabaseController::show
 * @see app/Http/Controllers/ManagedDatabaseController.php:50
 * @route '/databases/{database}'
 */
export const show = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/databases/{database}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ManagedDatabaseController::show
 * @see app/Http/Controllers/ManagedDatabaseController.php:50
 * @route '/databases/{database}'
 */
show.url = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { database: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { database: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    database: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        database: typeof args.database === 'object'
                ? args.database.uuid
                : args.database,
                }

    return show.definition.url
            .replace('{database}', parsedArgs.database.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ManagedDatabaseController::show
 * @see app/Http/Controllers/ManagedDatabaseController.php:50
 * @route '/databases/{database}'
 */
show.get = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ManagedDatabaseController::show
 * @see app/Http/Controllers/ManagedDatabaseController.php:50
 * @route '/databases/{database}'
 */
show.head = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ManagedDatabaseController::show
 * @see app/Http/Controllers/ManagedDatabaseController.php:50
 * @route '/databases/{database}'
 */
    const showForm = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ManagedDatabaseController::show
 * @see app/Http/Controllers/ManagedDatabaseController.php:50
 * @route '/databases/{database}'
 */
        showForm.get = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ManagedDatabaseController::show
 * @see app/Http/Controllers/ManagedDatabaseController.php:50
 * @route '/databases/{database}'
 */
        showForm.head = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\ManagedDatabaseController::destroy
 * @see app/Http/Controllers/ManagedDatabaseController.php:165
 * @route '/databases/{database}'
 */
export const destroy = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/databases/{database}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ManagedDatabaseController::destroy
 * @see app/Http/Controllers/ManagedDatabaseController.php:165
 * @route '/databases/{database}'
 */
destroy.url = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { database: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { database: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    database: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        database: typeof args.database === 'object'
                ? args.database.uuid
                : args.database,
                }

    return destroy.definition.url
            .replace('{database}', parsedArgs.database.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ManagedDatabaseController::destroy
 * @see app/Http/Controllers/ManagedDatabaseController.php:165
 * @route '/databases/{database}'
 */
destroy.delete = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ManagedDatabaseController::destroy
 * @see app/Http/Controllers/ManagedDatabaseController.php:165
 * @route '/databases/{database}'
 */
    const destroyForm = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ManagedDatabaseController::destroy
 * @see app/Http/Controllers/ManagedDatabaseController.php:165
 * @route '/databases/{database}'
 */
        destroyForm.delete = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\ManagedDatabaseController::backup
 * @see app/Http/Controllers/ManagedDatabaseController.php:61
 * @route '/databases/{database}/backup'
 */
export const backup = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: backup.url(args, options),
    method: 'get',
})

backup.definition = {
    methods: ["get","head"],
    url: '/databases/{database}/backup',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ManagedDatabaseController::backup
 * @see app/Http/Controllers/ManagedDatabaseController.php:61
 * @route '/databases/{database}/backup'
 */
backup.url = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { database: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { database: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    database: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        database: typeof args.database === 'object'
                ? args.database.uuid
                : args.database,
                }

    return backup.definition.url
            .replace('{database}', parsedArgs.database.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ManagedDatabaseController::backup
 * @see app/Http/Controllers/ManagedDatabaseController.php:61
 * @route '/databases/{database}/backup'
 */
backup.get = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: backup.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ManagedDatabaseController::backup
 * @see app/Http/Controllers/ManagedDatabaseController.php:61
 * @route '/databases/{database}/backup'
 */
backup.head = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: backup.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ManagedDatabaseController::backup
 * @see app/Http/Controllers/ManagedDatabaseController.php:61
 * @route '/databases/{database}/backup'
 */
    const backupForm = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: backup.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ManagedDatabaseController::backup
 * @see app/Http/Controllers/ManagedDatabaseController.php:61
 * @route '/databases/{database}/backup'
 */
        backupForm.get = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: backup.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ManagedDatabaseController::backup
 * @see app/Http/Controllers/ManagedDatabaseController.php:61
 * @route '/databases/{database}/backup'
 */
        backupForm.head = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: backup.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    backup.form = backupForm
/**
* @see \App\Http\Controllers\ManagedDatabaseController::restore
 * @see app/Http/Controllers/ManagedDatabaseController.php:110
 * @route '/databases/{database}/restore'
 */
export const restore = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restore.url(args, options),
    method: 'post',
})

restore.definition = {
    methods: ["post"],
    url: '/databases/{database}/restore',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ManagedDatabaseController::restore
 * @see app/Http/Controllers/ManagedDatabaseController.php:110
 * @route '/databases/{database}/restore'
 */
restore.url = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { database: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { database: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    database: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        database: typeof args.database === 'object'
                ? args.database.uuid
                : args.database,
                }

    return restore.definition.url
            .replace('{database}', parsedArgs.database.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ManagedDatabaseController::restore
 * @see app/Http/Controllers/ManagedDatabaseController.php:110
 * @route '/databases/{database}/restore'
 */
restore.post = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restore.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ManagedDatabaseController::restore
 * @see app/Http/Controllers/ManagedDatabaseController.php:110
 * @route '/databases/{database}/restore'
 */
    const restoreForm = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: restore.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ManagedDatabaseController::restore
 * @see app/Http/Controllers/ManagedDatabaseController.php:110
 * @route '/databases/{database}/restore'
 */
        restoreForm.post = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: restore.url(args, options),
            method: 'post',
        })
    
    restore.form = restoreForm
/**
* @see \App\Http\Controllers\ManagedDatabaseController::resetPassword
 * @see app/Http/Controllers/ManagedDatabaseController.php:155
 * @route '/databases/{database}/reset-password'
 */
export const resetPassword = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resetPassword.url(args, options),
    method: 'post',
})

resetPassword.definition = {
    methods: ["post"],
    url: '/databases/{database}/reset-password',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ManagedDatabaseController::resetPassword
 * @see app/Http/Controllers/ManagedDatabaseController.php:155
 * @route '/databases/{database}/reset-password'
 */
resetPassword.url = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { database: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { database: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    database: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        database: typeof args.database === 'object'
                ? args.database.uuid
                : args.database,
                }

    return resetPassword.definition.url
            .replace('{database}', parsedArgs.database.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ManagedDatabaseController::resetPassword
 * @see app/Http/Controllers/ManagedDatabaseController.php:155
 * @route '/databases/{database}/reset-password'
 */
resetPassword.post = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resetPassword.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ManagedDatabaseController::resetPassword
 * @see app/Http/Controllers/ManagedDatabaseController.php:155
 * @route '/databases/{database}/reset-password'
 */
    const resetPasswordForm = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: resetPassword.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ManagedDatabaseController::resetPassword
 * @see app/Http/Controllers/ManagedDatabaseController.php:155
 * @route '/databases/{database}/reset-password'
 */
        resetPasswordForm.post = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: resetPassword.url(args, options),
            method: 'post',
        })
    
    resetPassword.form = resetPasswordForm
const databases = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
destroy: Object.assign(destroy, destroy),
backup: Object.assign(backup, backup),
backups: Object.assign(backups, backups),
restore: Object.assign(restore, restore),
resetPassword: Object.assign(resetPassword, resetPassword),
}

export default databases