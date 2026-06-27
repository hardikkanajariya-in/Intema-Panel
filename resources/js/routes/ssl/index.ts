import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\SslController::index
 * @see app/Http/Controllers/SslController.php:10
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
 * @see app/Http/Controllers/SslController.php:10
 * @route '/ssl'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SslController::index
 * @see app/Http/Controllers/SslController.php:10
 * @route '/ssl'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SslController::index
 * @see app/Http/Controllers/SslController.php:10
 * @route '/ssl'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SslController::index
 * @see app/Http/Controllers/SslController.php:10
 * @route '/ssl'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SslController::index
 * @see app/Http/Controllers/SslController.php:10
 * @route '/ssl'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SslController::index
 * @see app/Http/Controllers/SslController.php:10
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
const ssl = {
    index: Object.assign(index, index),
}

export default ssl