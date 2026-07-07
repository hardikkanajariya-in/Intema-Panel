import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SetupController::index
 * @see app/Http/Controllers/SetupController.php:19
 * @route '/setup'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/setup',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SetupController::index
 * @see app/Http/Controllers/SetupController.php:19
 * @route '/setup'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SetupController::index
 * @see app/Http/Controllers/SetupController.php:19
 * @route '/setup'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SetupController::index
 * @see app/Http/Controllers/SetupController.php:19
 * @route '/setup'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SetupController::index
 * @see app/Http/Controllers/SetupController.php:19
 * @route '/setup'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SetupController::index
 * @see app/Http/Controllers/SetupController.php:19
 * @route '/setup'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SetupController::index
 * @see app/Http/Controllers/SetupController.php:19
 * @route '/setup'
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
* @see \App\Http\Controllers\SetupController::store
 * @see app/Http/Controllers/SetupController.php:38
 * @route '/setup'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/setup',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SetupController::store
 * @see app/Http/Controllers/SetupController.php:38
 * @route '/setup'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SetupController::store
 * @see app/Http/Controllers/SetupController.php:38
 * @route '/setup'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SetupController::store
 * @see app/Http/Controllers/SetupController.php:38
 * @route '/setup'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SetupController::store
 * @see app/Http/Controllers/SetupController.php:38
 * @route '/setup'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const SetupController = { index, store }

export default SetupController