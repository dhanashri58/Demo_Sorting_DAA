import time
import copy
from algorithms.quick_sort import quick_sort
from algorithms.merge_sort import merge_sort
from services.verification_service import verify_sorted

def run_benchmark(data, algorithm, input_type):
    # Create a deep copy to ensure original data is not modified and both algos can get identical data
    arr = copy.deepcopy(data)
    
    # Pre-process input order based on user selection
    if input_type == "Sorted":
        arr.sort()
    elif input_type == "Reverse Sorted":
        arr.sort(reverse=True)
    # "Random" remains as the parsed list
    
    start_time = time.perf_counter()
    if algorithm == "quick":
        sorted_arr, comparisons, ops = quick_sort(arr)
    else:
        sorted_arr, comparisons, ops = merge_sort(arr)
    end_time = time.perf_counter()

    exec_time_ms = (end_time - start_time) * 1000
    is_correct = verify_sorted(sorted_arr)
    
    return {
        "execution_time_ms": round(exec_time_ms, 2),
        "comparisons": comparisons,
        "operations": ops,
        "correct": is_correct,
        "sorted_preview": sorted_arr[:50] # Send back some rows to display
    }
