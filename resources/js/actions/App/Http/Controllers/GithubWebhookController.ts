import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\GithubWebhookController::handle
 * @see app/Http/Controllers/GithubWebhookController.php:12
 * @route '/api/webhooks/github'
 */
export const handle = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handle.url(options),
    method: 'post',
})

handle.definition = {
    methods: ["post"],
    url: '/api/webhooks/github',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GithubWebhookController::handle
 * @see app/Http/Controllers/GithubWebhookController.php:12
 * @route '/api/webhooks/github'
 */
handle.url = (options?: RouteQueryOptions) => {
    return handle.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GithubWebhookController::handle
 * @see app/Http/Controllers/GithubWebhookController.php:12
 * @route '/api/webhooks/github'
 */
handle.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handle.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GithubWebhookController::handle
 * @see app/Http/Controllers/GithubWebhookController.php:12
 * @route '/api/webhooks/github'
 */
    const handleForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: handle.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GithubWebhookController::handle
 * @see app/Http/Controllers/GithubWebhookController.php:12
 * @route '/api/webhooks/github'
 */
        handleForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: handle.url(options),
            method: 'post',
        })
    
    handle.form = handleForm
const GithubWebhookController = { handle }

export default GithubWebhookController