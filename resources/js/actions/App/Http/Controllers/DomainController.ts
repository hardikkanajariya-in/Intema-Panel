import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DomainController::index
 * @see app/Http/Controllers/DomainController.php:24
 * @route '/domains'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/domains',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DomainController::index
 * @see app/Http/Controllers/DomainController.php:24
 * @route '/domains'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DomainController::index
 * @see app/Http/Controllers/DomainController.php:24
 * @route '/domains'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DomainController::index
 * @see app/Http/Controllers/DomainController.php:24
 * @route '/domains'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DomainController::index
 * @see app/Http/Controllers/DomainController.php:24
 * @route '/domains'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DomainController::index
 * @see app/Http/Controllers/DomainController.php:24
 * @route '/domains'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DomainController::index
 * @see app/Http/Controllers/DomainController.php:24
 * @route '/domains'
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
* @see \App\Http\Controllers\DomainController::create
 * @see app/Http/Controllers/DomainController.php:113
 * @route '/domains/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/domains/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DomainController::create
 * @see app/Http/Controllers/DomainController.php:113
 * @route '/domains/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DomainController::create
 * @see app/Http/Controllers/DomainController.php:113
 * @route '/domains/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DomainController::create
 * @see app/Http/Controllers/DomainController.php:113
 * @route '/domains/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DomainController::create
 * @see app/Http/Controllers/DomainController.php:113
 * @route '/domains/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DomainController::create
 * @see app/Http/Controllers/DomainController.php:113
 * @route '/domains/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DomainController::create
 * @see app/Http/Controllers/DomainController.php:113
 * @route '/domains/create'
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
* @see \App\Http\Controllers\DomainController::store
 * @see app/Http/Controllers/DomainController.php:137
 * @route '/domains'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/domains',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DomainController::store
 * @see app/Http/Controllers/DomainController.php:137
 * @route '/domains'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DomainController::store
 * @see app/Http/Controllers/DomainController.php:137
 * @route '/domains'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DomainController::store
 * @see app/Http/Controllers/DomainController.php:137
 * @route '/domains'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DomainController::store
 * @see app/Http/Controllers/DomainController.php:137
 * @route '/domains'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\DomainController::show
 * @see app/Http/Controllers/DomainController.php:65
 * @route '/domains/{domain}'
 */
export const show = (args: { domain: string | { uuid: string } } | [domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/domains/{domain}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DomainController::show
 * @see app/Http/Controllers/DomainController.php:65
 * @route '/domains/{domain}'
 */
show.url = (args: { domain: string | { uuid: string } } | [domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { domain: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { domain: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    domain: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        domain: typeof args.domain === 'object'
                ? args.domain.uuid
                : args.domain,
                }

    return show.definition.url
            .replace('{domain}', parsedArgs.domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DomainController::show
 * @see app/Http/Controllers/DomainController.php:65
 * @route '/domains/{domain}'
 */
show.get = (args: { domain: string | { uuid: string } } | [domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DomainController::show
 * @see app/Http/Controllers/DomainController.php:65
 * @route '/domains/{domain}'
 */
show.head = (args: { domain: string | { uuid: string } } | [domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DomainController::show
 * @see app/Http/Controllers/DomainController.php:65
 * @route '/domains/{domain}'
 */
    const showForm = (args: { domain: string | { uuid: string } } | [domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DomainController::show
 * @see app/Http/Controllers/DomainController.php:65
 * @route '/domains/{domain}'
 */
        showForm.get = (args: { domain: string | { uuid: string } } | [domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DomainController::show
 * @see app/Http/Controllers/DomainController.php:65
 * @route '/domains/{domain}'
 */
        showForm.head = (args: { domain: string | { uuid: string } } | [domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\DomainController::destroy
 * @see app/Http/Controllers/DomainController.php:98
 * @route '/domains/{domain}'
 */
export const destroy = (args: { domain: string | { uuid: string } } | [domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/domains/{domain}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\DomainController::destroy
 * @see app/Http/Controllers/DomainController.php:98
 * @route '/domains/{domain}'
 */
destroy.url = (args: { domain: string | { uuid: string } } | [domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { domain: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { domain: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    domain: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        domain: typeof args.domain === 'object'
                ? args.domain.uuid
                : args.domain,
                }

    return destroy.definition.url
            .replace('{domain}', parsedArgs.domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DomainController::destroy
 * @see app/Http/Controllers/DomainController.php:98
 * @route '/domains/{domain}'
 */
destroy.delete = (args: { domain: string | { uuid: string } } | [domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\DomainController::destroy
 * @see app/Http/Controllers/DomainController.php:98
 * @route '/domains/{domain}'
 */
    const destroyForm = (args: { domain: string | { uuid: string } } | [domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DomainController::destroy
 * @see app/Http/Controllers/DomainController.php:98
 * @route '/domains/{domain}'
 */
        destroyForm.delete = (args: { domain: string | { uuid: string } } | [domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\DomainController::configureSsl
 * @see app/Http/Controllers/DomainController.php:79
 * @route '/domains/{domain}/configure-ssl'
 */
export const configureSsl = (args: { domain: string | { uuid: string } } | [domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: configureSsl.url(args, options),
    method: 'post',
})

configureSsl.definition = {
    methods: ["post"],
    url: '/domains/{domain}/configure-ssl',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DomainController::configureSsl
 * @see app/Http/Controllers/DomainController.php:79
 * @route '/domains/{domain}/configure-ssl'
 */
configureSsl.url = (args: { domain: string | { uuid: string } } | [domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { domain: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { domain: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    domain: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        domain: typeof args.domain === 'object'
                ? args.domain.uuid
                : args.domain,
                }

    return configureSsl.definition.url
            .replace('{domain}', parsedArgs.domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DomainController::configureSsl
 * @see app/Http/Controllers/DomainController.php:79
 * @route '/domains/{domain}/configure-ssl'
 */
configureSsl.post = (args: { domain: string | { uuid: string } } | [domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: configureSsl.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DomainController::configureSsl
 * @see app/Http/Controllers/DomainController.php:79
 * @route '/domains/{domain}/configure-ssl'
 */
    const configureSslForm = (args: { domain: string | { uuid: string } } | [domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: configureSsl.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DomainController::configureSsl
 * @see app/Http/Controllers/DomainController.php:79
 * @route '/domains/{domain}/configure-ssl'
 */
        configureSslForm.post = (args: { domain: string | { uuid: string } } | [domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: configureSsl.url(args, options),
            method: 'post',
        })
    
    configureSsl.form = configureSslForm
const DomainController = { index, create, store, show, destroy, configureSsl }

export default DomainController