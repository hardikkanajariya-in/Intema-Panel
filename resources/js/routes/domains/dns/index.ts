import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\DnsRecordController::index
 * @see app/Http/Controllers/DnsRecordController.php:16
 * @route '/domains/{domain}/dns-records'
 */
export const index = (args: { domain: string | { uuid: string } } | [domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/domains/{domain}/dns-records',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DnsRecordController::index
 * @see app/Http/Controllers/DnsRecordController.php:16
 * @route '/domains/{domain}/dns-records'
 */
index.url = (args: { domain: string | { uuid: string } } | [domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return index.definition.url
            .replace('{domain}', parsedArgs.domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DnsRecordController::index
 * @see app/Http/Controllers/DnsRecordController.php:16
 * @route '/domains/{domain}/dns-records'
 */
index.get = (args: { domain: string | { uuid: string } } | [domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DnsRecordController::index
 * @see app/Http/Controllers/DnsRecordController.php:16
 * @route '/domains/{domain}/dns-records'
 */
index.head = (args: { domain: string | { uuid: string } } | [domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DnsRecordController::index
 * @see app/Http/Controllers/DnsRecordController.php:16
 * @route '/domains/{domain}/dns-records'
 */
    const indexForm = (args: { domain: string | { uuid: string } } | [domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DnsRecordController::index
 * @see app/Http/Controllers/DnsRecordController.php:16
 * @route '/domains/{domain}/dns-records'
 */
        indexForm.get = (args: { domain: string | { uuid: string } } | [domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DnsRecordController::index
 * @see app/Http/Controllers/DnsRecordController.php:16
 * @route '/domains/{domain}/dns-records'
 */
        indexForm.head = (args: { domain: string | { uuid: string } } | [domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\DnsRecordController::store
 * @see app/Http/Controllers/DnsRecordController.php:45
 * @route '/domains/{domain}/dns-records'
 */
export const store = (args: { domain: string | { uuid: string } } | [domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/domains/{domain}/dns-records',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DnsRecordController::store
 * @see app/Http/Controllers/DnsRecordController.php:45
 * @route '/domains/{domain}/dns-records'
 */
store.url = (args: { domain: string | { uuid: string } } | [domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{domain}', parsedArgs.domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DnsRecordController::store
 * @see app/Http/Controllers/DnsRecordController.php:45
 * @route '/domains/{domain}/dns-records'
 */
store.post = (args: { domain: string | { uuid: string } } | [domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DnsRecordController::store
 * @see app/Http/Controllers/DnsRecordController.php:45
 * @route '/domains/{domain}/dns-records'
 */
    const storeForm = (args: { domain: string | { uuid: string } } | [domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DnsRecordController::store
 * @see app/Http/Controllers/DnsRecordController.php:45
 * @route '/domains/{domain}/dns-records'
 */
        storeForm.post = (args: { domain: string | { uuid: string } } | [domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\DnsRecordController::update
 * @see app/Http/Controllers/DnsRecordController.php:109
 * @route '/domains/{domain}/dns-records/{recordId}'
 */
export const update = (args: { domain: string | { uuid: string }, recordId: string | number } | [domain: string | { uuid: string }, recordId: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/domains/{domain}/dns-records/{recordId}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\DnsRecordController::update
 * @see app/Http/Controllers/DnsRecordController.php:109
 * @route '/domains/{domain}/dns-records/{recordId}'
 */
update.url = (args: { domain: string | { uuid: string }, recordId: string | number } | [domain: string | { uuid: string }, recordId: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    domain: args[0],
                    recordId: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        domain: typeof args.domain === 'object'
                ? args.domain.uuid
                : args.domain,
                                recordId: args.recordId,
                }

    return update.definition.url
            .replace('{domain}', parsedArgs.domain.toString())
            .replace('{recordId}', parsedArgs.recordId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DnsRecordController::update
 * @see app/Http/Controllers/DnsRecordController.php:109
 * @route '/domains/{domain}/dns-records/{recordId}'
 */
update.put = (args: { domain: string | { uuid: string }, recordId: string | number } | [domain: string | { uuid: string }, recordId: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\DnsRecordController::update
 * @see app/Http/Controllers/DnsRecordController.php:109
 * @route '/domains/{domain}/dns-records/{recordId}'
 */
    const updateForm = (args: { domain: string | { uuid: string }, recordId: string | number } | [domain: string | { uuid: string }, recordId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DnsRecordController::update
 * @see app/Http/Controllers/DnsRecordController.php:109
 * @route '/domains/{domain}/dns-records/{recordId}'
 */
        updateForm.put = (args: { domain: string | { uuid: string }, recordId: string | number } | [domain: string | { uuid: string }, recordId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\DnsRecordController::destroy
 * @see app/Http/Controllers/DnsRecordController.php:81
 * @route '/domains/{domain}/dns-records/{recordId}'
 */
export const destroy = (args: { domain: string | { uuid: string }, recordId: string | number } | [domain: string | { uuid: string }, recordId: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/domains/{domain}/dns-records/{recordId}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\DnsRecordController::destroy
 * @see app/Http/Controllers/DnsRecordController.php:81
 * @route '/domains/{domain}/dns-records/{recordId}'
 */
destroy.url = (args: { domain: string | { uuid: string }, recordId: string | number } | [domain: string | { uuid: string }, recordId: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    domain: args[0],
                    recordId: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        domain: typeof args.domain === 'object'
                ? args.domain.uuid
                : args.domain,
                                recordId: args.recordId,
                }

    return destroy.definition.url
            .replace('{domain}', parsedArgs.domain.toString())
            .replace('{recordId}', parsedArgs.recordId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DnsRecordController::destroy
 * @see app/Http/Controllers/DnsRecordController.php:81
 * @route '/domains/{domain}/dns-records/{recordId}'
 */
destroy.delete = (args: { domain: string | { uuid: string }, recordId: string | number } | [domain: string | { uuid: string }, recordId: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\DnsRecordController::destroy
 * @see app/Http/Controllers/DnsRecordController.php:81
 * @route '/domains/{domain}/dns-records/{recordId}'
 */
    const destroyForm = (args: { domain: string | { uuid: string }, recordId: string | number } | [domain: string | { uuid: string }, recordId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DnsRecordController::destroy
 * @see app/Http/Controllers/DnsRecordController.php:81
 * @route '/domains/{domain}/dns-records/{recordId}'
 */
        destroyForm.delete = (args: { domain: string | { uuid: string }, recordId: string | number } | [domain: string | { uuid: string }, recordId: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const dns = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default dns