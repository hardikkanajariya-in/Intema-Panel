import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DatabaseController::index
 * @see app/Http/Controllers/DatabaseController.php:10
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
 * @see app/Http/Controllers/DatabaseController.php:10
 * @route '/databases'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DatabaseController::index
 * @see app/Http/Controllers/DatabaseController.php:10
 * @route '/databases'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DatabaseController::index
 * @see app/Http/Controllers/DatabaseController.php:10
 * @route '/databases'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DatabaseController::index
 * @see app/Http/Controllers/DatabaseController.php:10
 * @route '/databases'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DatabaseController::index
 * @see app/Http/Controllers/DatabaseController.php:10
 * @route '/databases'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DatabaseController::index
 * @see app/Http/Controllers/DatabaseController.php:10
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
const DatabaseController = { index }

export default DatabaseController