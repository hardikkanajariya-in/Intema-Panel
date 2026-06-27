import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SslCertificateController::index
 * @see app/Http/Controllers/SslCertificateController.php:18
 * @route '/ssl-certificates'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/ssl-certificates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SslCertificateController::index
 * @see app/Http/Controllers/SslCertificateController.php:18
 * @route '/ssl-certificates'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SslCertificateController::index
 * @see app/Http/Controllers/SslCertificateController.php:18
 * @route '/ssl-certificates'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SslCertificateController::index
 * @see app/Http/Controllers/SslCertificateController.php:18
 * @route '/ssl-certificates'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SslCertificateController::index
 * @see app/Http/Controllers/SslCertificateController.php:18
 * @route '/ssl-certificates'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SslCertificateController::index
 * @see app/Http/Controllers/SslCertificateController.php:18
 * @route '/ssl-certificates'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SslCertificateController::index
 * @see app/Http/Controllers/SslCertificateController.php:18
 * @route '/ssl-certificates'
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
* @see \App\Http\Controllers\SslCertificateController::show
 * @see app/Http/Controllers/SslCertificateController.php:42
 * @route '/ssl-certificates/{ssl_certificate}'
 */
export const show = (args: { ssl_certificate: string | { uuid: string } } | [ssl_certificate: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/ssl-certificates/{ssl_certificate}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SslCertificateController::show
 * @see app/Http/Controllers/SslCertificateController.php:42
 * @route '/ssl-certificates/{ssl_certificate}'
 */
show.url = (args: { ssl_certificate: string | { uuid: string } } | [ssl_certificate: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ssl_certificate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { ssl_certificate: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    ssl_certificate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ssl_certificate: typeof args.ssl_certificate === 'object'
                ? args.ssl_certificate.uuid
                : args.ssl_certificate,
                }

    return show.definition.url
            .replace('{ssl_certificate}', parsedArgs.ssl_certificate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SslCertificateController::show
 * @see app/Http/Controllers/SslCertificateController.php:42
 * @route '/ssl-certificates/{ssl_certificate}'
 */
show.get = (args: { ssl_certificate: string | { uuid: string } } | [ssl_certificate: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SslCertificateController::show
 * @see app/Http/Controllers/SslCertificateController.php:42
 * @route '/ssl-certificates/{ssl_certificate}'
 */
show.head = (args: { ssl_certificate: string | { uuid: string } } | [ssl_certificate: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SslCertificateController::show
 * @see app/Http/Controllers/SslCertificateController.php:42
 * @route '/ssl-certificates/{ssl_certificate}'
 */
    const showForm = (args: { ssl_certificate: string | { uuid: string } } | [ssl_certificate: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SslCertificateController::show
 * @see app/Http/Controllers/SslCertificateController.php:42
 * @route '/ssl-certificates/{ssl_certificate}'
 */
        showForm.get = (args: { ssl_certificate: string | { uuid: string } } | [ssl_certificate: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SslCertificateController::show
 * @see app/Http/Controllers/SslCertificateController.php:42
 * @route '/ssl-certificates/{ssl_certificate}'
 */
        showForm.head = (args: { ssl_certificate: string | { uuid: string } } | [ssl_certificate: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\SslCertificateController::destroy
 * @see app/Http/Controllers/SslCertificateController.php:62
 * @route '/ssl-certificates/{ssl_certificate}'
 */
export const destroy = (args: { ssl_certificate: string | { uuid: string } } | [ssl_certificate: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/ssl-certificates/{ssl_certificate}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SslCertificateController::destroy
 * @see app/Http/Controllers/SslCertificateController.php:62
 * @route '/ssl-certificates/{ssl_certificate}'
 */
destroy.url = (args: { ssl_certificate: string | { uuid: string } } | [ssl_certificate: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ssl_certificate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { ssl_certificate: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    ssl_certificate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ssl_certificate: typeof args.ssl_certificate === 'object'
                ? args.ssl_certificate.uuid
                : args.ssl_certificate,
                }

    return destroy.definition.url
            .replace('{ssl_certificate}', parsedArgs.ssl_certificate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SslCertificateController::destroy
 * @see app/Http/Controllers/SslCertificateController.php:62
 * @route '/ssl-certificates/{ssl_certificate}'
 */
destroy.delete = (args: { ssl_certificate: string | { uuid: string } } | [ssl_certificate: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\SslCertificateController::destroy
 * @see app/Http/Controllers/SslCertificateController.php:62
 * @route '/ssl-certificates/{ssl_certificate}'
 */
    const destroyForm = (args: { ssl_certificate: string | { uuid: string } } | [ssl_certificate: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SslCertificateController::destroy
 * @see app/Http/Controllers/SslCertificateController.php:62
 * @route '/ssl-certificates/{ssl_certificate}'
 */
        destroyForm.delete = (args: { ssl_certificate: string | { uuid: string } } | [ssl_certificate: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\SslCertificateController::renew
 * @see app/Http/Controllers/SslCertificateController.php:53
 * @route '/ssl-certificates/{ssl_certificate}/renew'
 */
export const renew = (args: { ssl_certificate: string | { uuid: string } } | [ssl_certificate: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: renew.url(args, options),
    method: 'post',
})

renew.definition = {
    methods: ["post"],
    url: '/ssl-certificates/{ssl_certificate}/renew',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SslCertificateController::renew
 * @see app/Http/Controllers/SslCertificateController.php:53
 * @route '/ssl-certificates/{ssl_certificate}/renew'
 */
renew.url = (args: { ssl_certificate: string | { uuid: string } } | [ssl_certificate: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ssl_certificate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { ssl_certificate: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    ssl_certificate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ssl_certificate: typeof args.ssl_certificate === 'object'
                ? args.ssl_certificate.uuid
                : args.ssl_certificate,
                }

    return renew.definition.url
            .replace('{ssl_certificate}', parsedArgs.ssl_certificate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SslCertificateController::renew
 * @see app/Http/Controllers/SslCertificateController.php:53
 * @route '/ssl-certificates/{ssl_certificate}/renew'
 */
renew.post = (args: { ssl_certificate: string | { uuid: string } } | [ssl_certificate: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: renew.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SslCertificateController::renew
 * @see app/Http/Controllers/SslCertificateController.php:53
 * @route '/ssl-certificates/{ssl_certificate}/renew'
 */
    const renewForm = (args: { ssl_certificate: string | { uuid: string } } | [ssl_certificate: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: renew.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SslCertificateController::renew
 * @see app/Http/Controllers/SslCertificateController.php:53
 * @route '/ssl-certificates/{ssl_certificate}/renew'
 */
        renewForm.post = (args: { ssl_certificate: string | { uuid: string } } | [ssl_certificate: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: renew.url(args, options),
            method: 'post',
        })
    
    renew.form = renewForm
const SslCertificateController = { index, show, destroy, renew }

export default SslCertificateController