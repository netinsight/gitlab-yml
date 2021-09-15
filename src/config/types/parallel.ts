interface ParallelClass {
    /**
     * Defines different variables for jobs that are running in parallel.
     */
    matrix: { [key: string]: any[] | number | string }[];
}

export { ParallelClass };