import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ManagedDatabaseController::show
 * @see app/Http/Controllers/ManagedDatabaseController.php:88
 * @route '/databases/{database}/restore'
 */
export const show = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/databases/{database}/restore',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ManagedDatabaseController::show
 * @see app/Http/Controllers/ManagedDatabaseController.php:88
 * @route '/databases/{database}/restore'
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
 * @see app/Http/Controllers/ManagedDatabaseController.php:88
 * @route '/databases/{database}/restore'
 */
show.get = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ManagedDatabaseController::show
 * @see app/Http/Controllers/ManagedDatabaseController.php:88
 * @route '/databases/{database}/restore'
 */
show.head = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ManagedDatabaseController::show
 * @see app/Http/Controllers/ManagedDatabaseController.php:88
 * @route '/databases/{database}/restore'
 */
    const showForm = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ManagedDatabaseController::show
 * @see app/Http/Controllers/ManagedDatabaseController.php:88
 * @route '/databases/{database}/restore'
 */
        showForm.get = (args: { database: string | { uuid: string } } | [database: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ManagedDatabaseController::show
 * @see app/Http/Controllers/ManagedDatabaseController.php:88
 * @route '/databases/{database}/restore'
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