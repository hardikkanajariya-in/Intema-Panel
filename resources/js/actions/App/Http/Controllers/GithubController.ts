import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\GithubController::repositories
 * @see app/Http/Controllers/GithubController.php:16
 * @route '/github/repositories'
 */
export const repositories = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: repositories.url(options),
    method: 'get',
})

repositories.definition = {
    methods: ["get","head"],
    url: '/github/repositories',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GithubController::repositories
 * @see app/Http/Controllers/GithubController.php:16
 * @route '/github/repositories'
 */
repositories.url = (options?: RouteQueryOptions) => {
    return repositories.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GithubController::repositories
 * @see app/Http/Controllers/GithubController.php:16
 * @route '/github/repositories'
 */
repositories.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: repositories.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GithubController::repositories
 * @see app/Http/Controllers/GithubController.php:16
 * @route '/github/repositories'
 */
repositories.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: repositories.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GithubController::repositories
 * @see app/Http/Controllers/GithubController.php:16
 * @route '/github/repositories'
 */
    const repositoriesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: repositories.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GithubController::repositories
 * @see app/Http/Controllers/GithubController.php:16
 * @route '/github/repositories'
 */
        repositoriesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: repositories.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GithubController::repositories
 * @see app/Http/Controllers/GithubController.php:16
 * @route '/github/repositories'
 */
        repositoriesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: repositories.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    repositories.form = repositoriesForm
/**
* @see \App\Http\Controllers\GithubController::branches
 * @see app/Http/Controllers/GithubController.php:51
 * @route '/github/branches'
 */
export const branches = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: branches.url(options),
    method: 'get',
})

branches.definition = {
    methods: ["get","head"],
    url: '/github/branches',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GithubController::branches
 * @see app/Http/Controllers/GithubController.php:51
 * @route '/github/branches'
 */
branches.url = (options?: RouteQueryOptions) => {
    return branches.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GithubController::branches
 * @see app/Http/Controllers/GithubController.php:51
 * @route '/github/branches'
 */
branches.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: branches.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GithubController::branches
 * @see app/Http/Controllers/GithubController.php:51
 * @route '/github/branches'
 */
branches.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: branches.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GithubController::branches
 * @see app/Http/Controllers/GithubController.php:51
 * @route '/github/branches'
 */
    const branchesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: branches.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GithubController::branches
 * @see app/Http/Controllers/GithubController.php:51
 * @route '/github/branches'
 */
        branchesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: branches.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GithubController::branches
 * @see app/Http/Controllers/GithubController.php:51
 * @route '/github/branches'
 */
        branchesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: branches.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    branches.form = branchesForm
const GithubController = { repositories, branches }

export default GithubController