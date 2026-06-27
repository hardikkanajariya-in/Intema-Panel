import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\AppearanceController::update
 * @see app/Http/Controllers/AppearanceController.php:10
 * @route '/appearance'
 */
export const update = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
});

update.definition = {
    methods: ['post'],
    url: '/appearance',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\AppearanceController::update
 * @see app/Http/Controllers/AppearanceController.php:10
 * @route '/appearance'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\AppearanceController::update
 * @see app/Http/Controllers/AppearanceController.php:10
 * @route '/appearance'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\AppearanceController::update
 * @see app/Http/Controllers/AppearanceController.php:10
 * @route '/appearance'
 */
const updateForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: update.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\AppearanceController::update
 * @see app/Http/Controllers/AppearanceController.php:10
 * @route '/appearance'
 */
updateForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: update.url(options),
    method: 'post',
});

update.form = updateForm;
const AppearanceController = { update };

export default AppearanceController;
