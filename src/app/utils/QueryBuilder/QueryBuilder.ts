/* eslint-disable @typescript-eslint/no-explicit-any */
import { Query } from "mongoose";

export class QueryBuilder<T> {
    public modelQuery: Query<T[], T>;
    public readonly query: Record<string, string>;
    private filters: Record<string, any> = {};

    constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
        this.modelQuery = modelQuery;
        this.query = query;
    }

    search(searchableFields: string[]): this {
        const search = this.query.search;
        if (!search) return this;

        const searchTerm = {
            $or: searchableFields.map(field => ({
                [field]: { $regex: search, $options: "i" }
            }))
        };

        // accumulate filters
        this.filters = { ...this.filters, ...searchTerm };
        return this;
    }

    filter(): this {
        // Exclude special query params
        const excludeFields = ["search", "page", "limit"];
        for (const key of Object.keys(this.query)) {
            if (!excludeFields.includes(key)) {
                this.filters[key] = this.query[key];
            }
        }

        // Apply filters immediately
        this.modelQuery = this.modelQuery.find(this.filters);

        return this;
    }

    pagination(): this {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (page - 1) * limit;
        if (!this.modelQuery.getFilter() || Object.keys(this.modelQuery.getFilter()).length === 0) {
            this.modelQuery = this.modelQuery.find(this.filters);
        }

        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }

    async meta() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;

        const totalDocuments = await this.modelQuery.model.countDocuments(this.filters);
        const totalPage = Math.ceil(totalDocuments / limit);

        return { page, limit, total: totalDocuments, totalPage };
    }
};