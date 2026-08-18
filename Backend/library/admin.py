from django.contrib import admin

from .models import Book, FreeBook, LibrarianConversation, LibrarianMessage, ReadingChallenge, UserBook


class LibrarianMessageInline(admin.TabularInline):
    model = LibrarianMessage
    extra = 0


@admin.register(LibrarianConversation)
class LibrarianConversationAdmin(admin.ModelAdmin):
    list_display = ('youth', 'created_at')
    search_fields = ('youth__full_name',)
    inlines = [LibrarianMessageInline]


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'reading_level', 'difficulty_rating')
    list_filter = ('category', 'reading_level')
    search_fields = ('title', 'author')


@admin.register(FreeBook)
class FreeBookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'gutenberg_id')
    list_filter = ('category',)
    search_fields = ('title', 'author')


@admin.register(UserBook)
class UserBookAdmin(admin.ModelAdmin):
    list_display = ('youth', 'book', 'status', 'rating', 'is_favorite', 'updated_at')
    list_filter = ('status', 'is_favorite')
    search_fields = ('youth__full_name', 'book__title')


@admin.register(ReadingChallenge)
class ReadingChallengeAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'target_count', 'period', 'is_active')
    list_filter = ('period', 'is_active')
