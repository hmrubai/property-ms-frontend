import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncate'
})

export class TruncatePipe implements PipeTransform {

    transform(value: string, length: number): string {
        // let limit = args.length > 0 ? parseInt(args[0], 10) : 10;
        // let trail = args.length > 1 ? args[1] : '...';
        let limit = length ? length : 5;
        let trail = '...';

        return value.length > limit ? value.substring(0, limit) + trail : value;
    }
}