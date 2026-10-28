import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageUrl',
  standalone: true
})
export class ImageUrlPipe implements PipeTransform {

  transform(value: unknown, type: 'food' | 'restaurant' = 'food'): string {
    const val = typeof value === 'string' ? value.toLowerCase() : '';

    if (val.includes('http://') || val.includes('https://')) {
      return val;
    }

    if (type === 'restaurant') {
      return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';
    }

    if (val.includes('pizza')) {
      return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80';
    }
    if (val.includes('burger') || val.includes('sandwich')) {
      return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80';
    }
    if (val.includes('biryani') || val.includes('rice') || val.includes('chicken') || val.includes('meat')) {
      return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80';
    }
    if (val.includes('sushi') || val.includes('roll')) {
      return 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80';
    }
    if (val.includes('salad') || val.includes('healthy')) {
      return 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80';
    }
    if (val.includes('dessert') || val.includes('cake') || val.includes('sweet')) {
      return 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80';
    }

    // Default professional food photography
    return 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80';
  }

}
