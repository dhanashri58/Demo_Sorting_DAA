# Quick Sort vs Merge Sort for Large ML Datasets

## Problem Statement
Sorting a numerical feature is a foundational supporting operation for data analytics, ranking, and feature inspection. This project evaluates and compares the practical performance of Quick Sort and Merge Sort on real-world datasets of varying sizes and structures.

## Real-world Scenario
Large datasets are frequently processed for analytics, ranking, reporting, and feature inspection. Sorting a numerical feature can be a useful supporting operation before these tasks. This project compares Quick Sort and Merge Sort on the same dataset and under the same conditions.

## Features
- **CSV Upload & Parsing:** Upload any standard CSV file and instantly parse columns.
- **Automatic Numeric Column Detection:** Safely filter and identify sortable features.
- **Custom Implementations:** Quick Sort and Merge Sort implemented completely from scratch. No built-in language sorting used.
- **Precise Benchmarking:** High-resolution timers recording execution time (ms), total comparisons, and element swaps/operations.
- **Verification:** Independent correctness verification applied after every sorting algorithm.
- **Input Order Testing:** Evaluate best/worst case scenarios by testing Random, Already Sorted, and Reverse Sorted orders.
- **Data Visualization:** Modern charting to directly compare execution times.

## Architecture & Tech Stack
**Frontend:** React, Vite, Recharts, Lucide-Icons
**Backend:** Python, FastAPI, Pandas

## Algorithm Explanations
### Quick Sort
Uses a divide-and-conquer strategy by selecting a 'pivot' element and partitioning the other elements into two sub-arrays, according to whether they are less than or greater than the pivot. This project uses a **Randomized Pivot** strategy to minimize the chance of hitting the O(n²) worst-case performance on naturally sorted datasets.

### Merge Sort
Also a divide-and-conquer algorithm that recursively divides the input array in half until each sub-array contains a single element, and then merges the sub-arrays to produce a newly sorted array. It provides a stable sort with predictable performance.

## Complexities
| Metric | Quick Sort | Merge Sort |
|--------|------------|------------|
| Best Case | O(n log n) | O(n log n) |
| Average Case | O(n log n) | O(n log n) |
| Worst Case | O(n²) | O(n log n) |
| Auxiliary Space | O(log n) (recursion stack) | O(n) |
| Stable | No | Yes |

## Benchmark Methodology
To ensure a fair and scientifically accurate test:
1. The uploaded CSV is parsed, and NaN values are dropped.
2. A deep copy of the exact same array is passed to both Quick Sort and Merge Sort. (Merge sort never receives a pre-sorted array from Quick Sort).
3. The algorithms use Python's `time.perf_counter()` for high-resolution nanosecond precision timing.

## Correctness Verification
After execution, the returned array is iterated through using a simple `array[i] <= array[i+1]` check. The UI clearly displays `✓ Verified` only if this test passes.

## How to Run

### 1. Run Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### 2. Run Frontend
```bash
cd frontend
npm install
npm run dev
```

## Presentation Demo Steps
1. Upload `Mall_Customers.csv` or any other dataset.
2. Observe dataset preview and auto-detected numeric columns.
3. Select a numeric column (e.g., `Spending Score (1-100)`).
4. Select Input Order: `Random`.
5. Click **COMPARE BOTH** to run the benchmark.
6. Present the side-by-side metrics (Execution Time, Comparisons, Operations).
7. Change Input Order to `Sorted` and run again to demonstrate algorithmic changes.
8. Change Input Order to `Reverse Sorted` and run again.
9. Conclude that Algorithm choice depends on input characteristics, memory constraints, stability requirements, pivot strategy, and application needs.
