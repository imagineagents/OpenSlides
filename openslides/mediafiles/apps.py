from django.apps import AppConfig


class MediafileAppConfig(AppConfig):
    name = 'openslides.mediafiles'
    verbose_name = 'OpenSlides Mediafiles'

    def ready(self):
        # Import all required stuff.
        from openslides.utils.rest_api import router
        from .views import MediafileViewSet

        # Register viewsets.
        router.register('mediafiles/mediafile', MediafileViewSet)
