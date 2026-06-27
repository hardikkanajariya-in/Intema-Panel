import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\DatabaseController::index
 * @see app/Http/Controllers/DatabaseController.php:20
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
* @see \App\Http\Controllers\DatabaseController::index
 * @see app/Http/Controllers/DatabaseController.php:20
 * @route '/databases'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DatabaseController::index
 * @see app/Http/Controllers/DatabaseController.php:20
 * @route '/databases'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DatabaseController::index
 * @see app/Http/Controllers/DatabaseController.php:20
 * @route '/databases'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DatabaseController::index
 * @see app/Http/Controllers/DatabaseController.php:20
 * @route '/databases'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DatabaseController::index
 * @see app/Http/Controllers/DatabaseController.php:20
 * @route '/databases'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DatabaseController::index
 * @see app/Http/Controllers/DatabaseController.php:20
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
* @see \App\Http\Controllers\DatabaseController::backup
 * @see app/Http/Controllers/DatabaseController.php:29
 * @route '/databases/{client}/backup'
 */
export const backup = (args: { client: number | { id: number } } | [client: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: backup.url(args, options),
    method: 'post',
})

backup.definition = {
    methods: ["post"],
    url: '/databases/{client}/backup',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DatabaseController::backup
 * @see app/Http/Controllers/DatabaseController.php:29
 * @route '/databases/{client}/backup'
 */
backup.url = (args: { client: number | { id: number } } | [client: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { client: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { client: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    client: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        client: typeof args.client === 'object'
                ? args.client.id
                : args.client,
                }

    return backup.definition.url
            .replace('{client}', parsedArgs.client.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DatabaseController::backup
 * @see app/Http/Controllers/DatabaseController.php:29
 * @route '/databases/{client}/backup'
 */
backup.post = (args: { client: number | { id: number } } | [client: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: backup.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DatabaseController::backup
 * @see app/Http/Controllers/DatabaseController.php:29
 * @route '/databases/{client}/backup'
 */
    const backupForm = (args: { client: number | { id: number } } | [client: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: backup.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DatabaseController::backup
 * @see app/Http/Controllers/DatabaseController.php:29
 * @route '/databases/{client}/backup'
 */
        backupForm.post = (args: { client: number | { id: number } } | [client: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: backup.url(args, options),
            method: 'post',
        })
    
    backup.form = backupForm
/**
* @see \App\Http\Controllers\DatabaseController::resetPassword
 * @see app/Http/Controllers/DatabaseController.php:36
 * @route '/databases/{client}/reset-password'
 */
export const resetPassword = (args: { client: number | { id: number } } | [client: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resetPassword.url(args, options),
    method: 'post',
})

resetPassword.definition = {
    methods: ["post"],
    url: '/databases/{client}/reset-password',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DatabaseController::resetPassword
 * @see app/Http/Controllers/DatabaseController.php:36
 * @route '/databases/{client}/reset-password'
 */
resetPassword.url = (args: { client: number | { id: number } } | [client: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { client: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { client: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    client: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        client: typeof args.client === 'object'
                ? args.client.id
                : args.client,
                }

    return resetPassword.definition.url
            .replace('{client}', parsedArgs.client.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DatabaseController::resetPassword
 * @see app/Http/Controllers/DatabaseController.php:36
 * @route '/databases/{client}/reset-password'
 */
resetPassword.post = (args: { client: number | { id: number } } | [client: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resetPassword.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DatabaseController::resetPassword
 * @see app/Http/Controllers/DatabaseController.php:36
 * @route '/databases/{client}/reset-password'
 */
    const resetPasswordForm = (args: { client: number | { id: number } } | [client: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: resetPassword.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DatabaseController::resetPassword
 * @see app/Http/Controllers/DatabaseController.php:36
 * @route '/databases/{client}/reset-password'
 */
        resetPasswordForm.post = (args: { client: number | { id: number } } | [client: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: resetPassword.url(args, options),
            method: 'post',
        })
    
    resetPassword.form = resetPasswordForm
const databases = {
    index: Object.assign(index, index),
backup: Object.assign(backup, backup),
resetPassword: Object.assign(resetPassword, resetPassword),
}

export default databases