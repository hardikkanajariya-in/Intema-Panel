import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\SslController::index
 * @see app/Http/Controllers/SslController.php:17
 * @route '/ssl'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/ssl',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SslController::index
 * @see app/Http/Controllers/SslController.php:17
 * @route '/ssl'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SslController::index
 * @see app/Http/Controllers/SslController.php:17
 * @route '/ssl'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SslController::index
 * @see app/Http/Controllers/SslController.php:17
 * @route '/ssl'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SslController::index
 * @see app/Http/Controllers/SslController.php:17
 * @route '/ssl'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SslController::index
 * @see app/Http/Controllers/SslController.php:17
 * @route '/ssl'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SslController::index
 * @see app/Http/Controllers/SslController.php:17
 * @route '/ssl'
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
* @see \App\Http\Controllers\SslController::store
 * @see app/Http/Controllers/SslController.php:25
 * @route '/ssl'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/ssl',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SslController::store
 * @see app/Http/Controllers/SslController.php:25
 * @route '/ssl'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SslController::store
 * @see app/Http/Controllers/SslController.php:25
 * @route '/ssl'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SslController::store
 * @see app/Http/Controllers/SslController.php:25
 * @route '/ssl'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SslController::store
 * @see app/Http/Controllers/SslController.php:25
 * @route '/ssl'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\SslController::renew
 * @see app/Http/Controllers/SslController.php:37
 * @route '/ssl/renew'
 */
export const renew = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: renew.url(options),
    method: 'post',
})

renew.definition = {
    methods: ["post"],
    url: '/ssl/renew',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SslController::renew
 * @see app/Http/Controllers/SslController.php:37
 * @route '/ssl/renew'
 */
renew.url = (options?: RouteQueryOptions) => {
    return renew.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SslController::renew
 * @see app/Http/Controllers/SslController.php:37
 * @route '/ssl/renew'
 */
renew.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: renew.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SslController::renew
 * @see app/Http/Controllers/SslController.php:37
 * @route '/ssl/renew'
 */
    const renewForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: renew.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SslController::renew
 * @see app/Http/Controllers/SslController.php:37
 * @route '/ssl/renew'
 */
        renewForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: renew.url(options),
            method: 'post',
        })
    
    renew.form = renewForm
/**
* @see \App\Http\Controllers\SslController::destroy
 * @see app/Http/Controllers/SslController.php:45
 * @route '/ssl/{domain}'
 */
export const destroy = (args: { domain: string | number } | [domain: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/ssl/{domain}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SslController::destroy
 * @see app/Http/Controllers/SslController.php:45
 * @route '/ssl/{domain}'
 */
destroy.url = (args: { domain: string | number } | [domain: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { domain: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    domain: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        domain: args.domain,
                }

    return destroy.definition.url
            .replace('{domain}', parsedArgs.domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SslController::destroy
 * @see app/Http/Controllers/SslController.php:45
 * @route '/ssl/{domain}'
 */
destroy.delete = (args: { domain: string | number } | [domain: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\SslController::destroy
 * @see app/Http/Controllers/SslController.php:45
 * @route '/ssl/{domain}'
 */
    const destroyForm = (args: { domain: string | number } | [domain: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SslController::destroy
 * @see app/Http/Controllers/SslController.php:45
 * @route '/ssl/{domain}'
 */
        destroyForm.delete = (args: { domain: string | number } | [domain: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const ssl = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
renew: Object.assign(renew, renew),
destroy: Object.assign(destroy, destroy),
}

export default ssl