import GithubWebhookController from './GithubWebhookController'
import SetupController from './SetupController'
import Auth from './Auth'
import AppearanceController from './AppearanceController'
import DashboardController from './DashboardController'
import ProjectController from './ProjectController'
import ApplicationController from './ApplicationController'
import ManagedDatabaseController from './ManagedDatabaseController'
import DomainController from './DomainController'
import DnsRecordController from './DnsRecordController'
import SystemController from './SystemController'
import FileManagerController from './FileManagerController'
import GithubController from './GithubController'
import ActivityLogController from './ActivityLogController'
import SettingsController from './SettingsController'
const Controllers = {
    GithubWebhookController: Object.assign(GithubWebhookController, GithubWebhookController),
SetupController: Object.assign(SetupController, SetupController),
Auth: Object.assign(Auth, Auth),
AppearanceController: Object.assign(AppearanceController, AppearanceController),
DashboardController: Object.assign(DashboardController, DashboardController),
ProjectController: Object.assign(ProjectController, ProjectController),
ApplicationController: Object.assign(ApplicationController, ApplicationController),
ManagedDatabaseController: Object.assign(ManagedDatabaseController, ManagedDatabaseController),
DomainController: Object.assign(DomainController, DomainController),
DnsRecordController: Object.assign(DnsRecordController, DnsRecordController),
SystemController: Object.assign(SystemController, SystemController),
FileManagerController: Object.assign(FileManagerController, FileManagerController),
GithubController: Object.assign(GithubController, GithubController),
ActivityLogController: Object.assign(ActivityLogController, ActivityLogController),
SettingsController: Object.assign(SettingsController, SettingsController),
}

export default Controllers