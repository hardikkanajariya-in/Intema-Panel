import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\GithubWebhookController::github
 * @see app/Http/Controllers/GithubWebhookController.php:12
 * @route '/api/webhooks/github'
 */
export const github = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: github.url(options),
    method: 'post',
})

github.definition = {
    methods: ["post"],
    url: '/api/webhooks/github',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GithubWebhookController::github
 * @see app/Http/Controllers/GithubWebhookController.php:12
 * @route '/api/webhooks/github'
 */
github.url = (options?: RouteQueryOptions) => {
    return github.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GithubWebhookController::github
 * @see app/Http/Controllers/GithubWebhookController.php:12
 * @route '/api/webhooks/github'
 */
github.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: github.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GithubWebhookController::github
 * @see app/Http/Controllers/GithubWebhookController.php:12
 * @route '/api/webhooks/github'
 */
    const githubForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: github.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GithubWebhookController::github
 * @see app/Http/Controllers/GithubWebhookController.php:12
 * @route '/api/webhooks/github'
 */
        githubForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: github.url(options),
            method: 'post',
        })
    
    github.form = githubForm
const webhooks = {
    github: Object.assign(github, github),
}

export default webhooks