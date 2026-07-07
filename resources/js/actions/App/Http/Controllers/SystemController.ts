import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SystemController::index
 * @see app/Http/Controllers/SystemController.php:19
 * @route '/system'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/system',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SystemController::index
 * @see app/Http/Controllers/SystemController.php:19
 * @route '/system'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SystemController::index
 * @see app/Http/Controllers/SystemController.php:19
 * @route '/system'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SystemController::index
 * @see app/Http/Controllers/SystemController.php:19
 * @route '/system'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SystemController::index
 * @see app/Http/Controllers/SystemController.php:19
 * @route '/system'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SystemController::index
 * @see app/Http/Controllers/SystemController.php:19
 * @route '/system'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SystemController::index
 * @see app/Http/Controllers/SystemController.php:19
 * @route '/system'
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
* @see \App\Http\Controllers\SystemController::action
 * @see app/Http/Controllers/SystemController.php:27
 * @route '/system/action'
 */
export const action = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: action.url(options),
    method: 'post',
})

action.definition = {
    methods: ["post"],
    url: '/system/action',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SystemController::action
 * @see app/Http/Controllers/SystemController.php:27
 * @route '/system/action'
 */
action.url = (options?: RouteQueryOptions) => {
    return action.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SystemController::action
 * @see app/Http/Controllers/SystemController.php:27
 * @route '/system/action'
 */
action.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: action.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SystemController::action
 * @see app/Http/Controllers/SystemController.php:27
 * @route '/system/action'
 */
    const actionForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: action.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SystemController::action
 * @see app/Http/Controllers/SystemController.php:27
 * @route '/system/action'
 */
        actionForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: action.url(options),
            method: 'post',
        })
    
    action.form = actionForm
/**
* @see \App\Http\Controllers\SystemController::update
 * @see app/Http/Controllers/SystemController.php:42
 * @route '/system/update'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/system/update',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SystemController::update
 * @see app/Http/Controllers/SystemController.php:42
 * @route '/system/update'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SystemController::update
 * @see app/Http/Controllers/SystemController.php:42
 * @route '/system/update'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SystemController::update
 * @see app/Http/Controllers/SystemController.php:42
 * @route '/system/update'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SystemController::update
 * @see app/Http/Controllers/SystemController.php:42
 * @route '/system/update'
 */
        updateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(options),
            method: 'post',
        })
    
    update.form = updateForm
const SystemController = { index, action, update }

export default SystemController