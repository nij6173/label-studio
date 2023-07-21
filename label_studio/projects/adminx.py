import xadmin
from .models import Project, ProjectOnboardingSteps, ProjectOnboarding, LabelStreamHistory, ProjectMember, ProjectSummary, ProjectImport


xadmin.sites.site.register(Project)
xadmin.sites.site.register(ProjectOnboardingSteps)
xadmin.sites.site.register(ProjectOnboarding)
xadmin.sites.site.register(LabelStreamHistory)
xadmin.sites.site.register(ProjectMember)
xadmin.sites.site.register(ProjectSummary)
xadmin.sites.site.register(ProjectImport)
