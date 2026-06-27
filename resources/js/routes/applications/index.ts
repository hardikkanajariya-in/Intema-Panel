import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ApplicationController::index
 * @see app/Http/Controllers/ApplicationController.php:19
 * @route '/applications'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/applications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ApplicationController::index
 * @see app/Http/Controllers/ApplicationController.php:19
 * @route '/applications'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApplicationController::index
 * @see app/Http/Controllers/ApplicationController.php:19
 * @route '/applications'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ApplicationController::index
 * @see app/Http/Controllers/ApplicationController.php:19
 * @route '/applications'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ApplicationController::index
 * @see app/Http/Controllers/ApplicationController.php:19
 * @route '/applications'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ApplicationController::index
 * @see app/Http/Controllers/ApplicationController.php:19
 * @route '/applications'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ApplicationController::index
 * @see app/Http/Controllers/ApplicationController.php:19
 * @route '/applications'
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
* @see \App\Http\Controllers\ApplicationController::show
 * @see app/Http/Controllers/ApplicationController.php:42
 * @route '/applications/{application}'
 */
export const show = (args: { application: string | { uuid: string } } | [application: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/applications/{application}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ApplicationController::show
 * @see app/Http/Controllers/ApplicationController.php:42
 * @route '/applications/{application}'
 */
show.url = (args: { application: string | { uuid: string } } | [application: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { application: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    application: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        application: typeof args.application === 'object'
                ? args.application.uuid
                : args.application,
                }

    return show.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApplicationController::show
 * @see app/Http/Controllers/ApplicationController.php:42
 * @route '/applications/{application}'
 */
show.get = (args: { application: string | { uuid: string } } | [application: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ApplicationController::show
 * @see app/Http/Controllers/ApplicationController.php:42
 * @route '/applications/{application}'
 */
show.head = (args: { application: string | { uuid: string } } | [application: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ApplicationController::show
 * @see app/Http/Controllers/ApplicationController.php:42
 * @route '/applications/{application}'
 */
    const showForm = (args: { application: string | { uuid: string } } | [application: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ApplicationController::show
 * @see app/Http/Controllers/ApplicationController.php:42
 * @route '/applications/{application}'
 */
        showForm.get = (args: { application: string | { uuid: string } } | [application: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ApplicationController::show
 * @see app/Http/Controllers/ApplicationController.php:42
 * @route '/applications/{application}'
 */
        showForm.head = (args: { application: string | { uuid: string } } | [application: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ApplicationController::destroy
 * @see app/Http/Controllers/ApplicationController.php:54
 * @route '/applications/{application}'
 */
export const destroy = (args: { application: string | { uuid: string } } | [application: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/applications/{application}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ApplicationController::destroy
 * @see app/Http/Controllers/ApplicationController.php:54
 * @route '/applications/{application}'
 */
destroy.url = (args: { application: string | { uuid: string } } | [application: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { application: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    application: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        application: typeof args.application === 'object'
                ? args.application.uuid
                : args.application,
                }

    return destroy.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApplicationController::destroy
 * @see app/Http/Controllers/ApplicationController.php:54
 * @route '/applications/{application}'
 */
destroy.delete = (args: { application: string | { uuid: string } } | [application: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ApplicationController::destroy
 * @see app/Http/Controllers/ApplicationController.php:54
 * @route '/applications/{application}'
 */
    const destroyForm = (args: { application: string | { uuid: string } } | [application: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApplicationController::destroy
 * @see app/Http/Controllers/ApplicationController.php:54
 * @route '/applications/{application}'
 */
        destroyForm.delete = (args: { application: string | { uuid: string } } | [application: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ApplicationController::repair
 * @see app/Http/Controllers/ApplicationController.php:66
 * @route '/applications/{application}/repair'
 */
export const repair = (args: { application: string | { uuid: string } } | [application: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: repair.url(args, options),
    method: 'post',
})

repair.definition = {
    methods: ["post"],
    url: '/applications/{application}/repair',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ApplicationController::repair
 * @see app/Http/Controllers/ApplicationController.php:66
 * @route '/applications/{application}/repair'
 */
repair.url = (args: { application: string | { uuid: string } } | [application: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { application: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    application: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        application: typeof args.application === 'object'
                ? args.application.uuid
                : args.application,
                }

    return repair.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApplicationController::repair
 * @see app/Http/Controllers/ApplicationController.php:66
 * @route '/applications/{application}/repair'
 */
repair.post = (args: { application: string | { uuid: string } } | [application: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: repair.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ApplicationController::repair
 * @see app/Http/Controllers/ApplicationController.php:66
 * @route '/applications/{application}/repair'
 */
    const repairForm = (args: { application: string | { uuid: string } } | [application: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: repair.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApplicationController::repair
 * @see app/Http/Controllers/ApplicationController.php:66
 * @route '/applications/{application}/repair'
 */
        repairForm.post = (args: { application: string | { uuid: string } } | [application: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: repair.url(args, options),
            method: 'post',
        })
    
    repair.form = repairForm
/**
* @see \App\Http\Controllers\ApplicationController::health
 * @see app/Http/Controllers/ApplicationController.php:80
 * @route '/applications/{application}/health'
 */
export const health = (args: { application: string | { uuid: string } } | [application: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: health.url(args, options),
    method: 'post',
})

health.definition = {
    methods: ["post"],
    url: '/applications/{application}/health',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ApplicationController::health
 * @see app/Http/Controllers/ApplicationController.php:80
 * @route '/applications/{application}/health'
 */
health.url = (args: { application: string | { uuid: string } } | [application: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { application: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    application: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        application: typeof args.application === 'object'
                ? args.application.uuid
                : args.application,
                }

    return health.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApplicationController::health
 * @see app/Http/Controllers/ApplicationController.php:80
 * @route '/applications/{application}/health'
 */
health.post = (args: { application: string | { uuid: string } } | [application: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: health.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ApplicationController::health
 * @see app/Http/Controllers/ApplicationController.php:80
 * @route '/applications/{application}/health'
 */
    const healthForm = (args: { application: string | { uuid: string } } | [application: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: health.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApplicationController::health
 * @see app/Http/Controllers/ApplicationController.php:80
 * @route '/applications/{application}/health'
 */
        healthForm.post = (args: { application: string | { uuid: string } } | [application: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: health.url(args, options),
            method: 'post',
        })
    
    health.form = healthForm
const applications = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
destroy: Object.assign(destroy, destroy),
repair: Object.assign(repair, repair),
health: Object.assign(health, health),
}

export default applications