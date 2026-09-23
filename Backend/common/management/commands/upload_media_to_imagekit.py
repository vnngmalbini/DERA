"""Copy existing files from MEDIA_ROOT to ImageKit, keeping their paths.

Paths are preserved (no unique suffix), so the names already stored in the
database keep resolving once ImageKit becomes the default storage.
"""

import posixpath

import requests
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from common.storage import TIMEOUT_SECONDS, UPLOAD_URL


class Command(BaseCommand):
    help = 'Upload every file under MEDIA_ROOT to ImageKit at the same path.'

    def handle(self, *args, **options):
        if not settings.IMAGEKIT_PRIVATE_KEY or not settings.IMAGEKIT_URL_ENDPOINT:
            raise CommandError('Set IMAGEKIT_PRIVATE_KEY and IMAGEKIT_URL_ENDPOINT first.')

        media_root = settings.MEDIA_ROOT
        files = [p for p in media_root.rglob('*') if p.is_file()]
        for path in files:
            name = path.relative_to(media_root).as_posix()
            folder, file_name = posixpath.split(name)
            with path.open('rb') as fh:
                response = requests.post(
                    UPLOAD_URL,
                    auth=(settings.IMAGEKIT_PRIVATE_KEY, ''),
                    files={'file': (file_name, fh)},
                    data={
                        'fileName': file_name,
                        'folder': f'/{folder}' if folder else '/',
                        'useUniqueFileName': 'false',
                        'overwriteFile': 'true',
                    },
                    timeout=TIMEOUT_SECONDS,
                )
            if response.ok:
                self.stdout.write(self.style.SUCCESS(f'Uploaded {name}'))
            else:
                self.stderr.write(f'Failed {name}: {response.status_code} {response.text}')
        self.stdout.write(f'Done: {len(files)} file(s) processed.')
