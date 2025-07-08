'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { MultiSelect } from '@/src/components/multiselect';
import { DateRangePicker } from '@/src/components/dateRangePicker';
import { DateRange } from 'react-day-picker';
import { useCategories } from '@/src/state/useCategory';
import { useTags } from '@/src/state/useTags';
import type { Category } from '@/src/types/category';



export function FilterBar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Fetch Kategorien und Tags
    const { categories } = useCategories();
    const { tags } = useTags();

    // Map to MultiSelect-Optionen
    const categoryOptions = categories.map((c: Category) => ({
        value: String(c.id),
        label: c.name,
    }));
    const tagOptions = tags.map(t => ({
        value: String(t.id),
        label: t.name,
    }));

    // State initialisiert aus Query
    const [selectedCategories, setSelectedCategories] = useState<string[]>(() =>
        searchParams.getAll('category'),
    );
    const [selectedTags, setSelectedTags] = useState<string[]>(() =>
        searchParams.getAll('tag'),
    );
    const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
        const from = searchParams.get('from');
        const to = searchParams.get('to');
        if (from && to) {
            const f = new Date(from);
            const t = new Date(to);
            if (!isNaN(f.getTime()) && !isNaN(t.getTime())) {
                return { from: f, to: t };
            }
        }
        return undefined;
    });

    useEffect(() => {
        setSelectedCategories(searchParams.getAll('category'));
        setSelectedTags(searchParams.getAll('tag'));

        const from = searchParams.get('from');
        const to = searchParams.get('to');
        if (from && to) {
            const f = new Date(from);
            const t = new Date(to);
            if (!isNaN(f.getTime()) && !isNaN(t.getTime())) {
                setDateRange({ from: f, to: t });
                return;
            }
        }
        setDateRange(undefined);
    }, [searchParams]);

    const updateParamList = (
        key: string,
        values: string[],
    ) => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete(key);
        values.forEach(v => params.append(key, v));
        router.replace(`${pathname}?${params.toString()}`);
    };

    const updateDateParams = (range?: DateRange) => {
        const params = new URLSearchParams(searchParams.toString());
        if (range?.from && range.to) {
            params.set('from', range.from.toISOString());
            params.set('to', range.to.toISOString());
        } else {
            params.delete('from');
            params.delete('to');
        }
        router.replace(`${pathname}?${params.toString()}`);
    };

    // Handlers
    const onCategoriesChange = (vals: string[]) => {
        setSelectedCategories(vals);
        updateParamList('category', vals);
    };

    const onTagsChange = (vals: string[]) => {
        setSelectedTags(vals);
        updateParamList('tag', vals);
    };

    const onDateChange = (range?: DateRange) => {
        setDateRange(range);
        updateDateParams(range);
    };

    return (
        <div>
            <p className='mb-2'>Filter</p>
            <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="w-1/5">
                    <MultiSelect
                        options={categoryOptions}
                        value={selectedCategories}
                        onValueChange={onCategoriesChange}
                        placeholder="Kategorie"
                        variant="inverted"
                    />
                </div>
                <div className="w-1/5">
                    <MultiSelect
                        options={tagOptions}
                        value={selectedTags}
                        onValueChange={onTagsChange}
                        placeholder="Tags"
                        variant="secondary"
                    />
                </div>
                <div className="w-1/6">
                    <DateRangePicker
                        value={dateRange}
                        onChange={onDateChange}
                    />
                </div>
            </div>
        </div>
    );
}
