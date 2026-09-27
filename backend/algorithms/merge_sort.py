import sys
sys.setrecursionlimit(2000000)

def merge_sort(arr):
    comparisons = [0]
    merge_operations = [0]
    
    def _merge_sort(items):
        if len(items) > 1:
            mid = len(items) // 2
            L = items[:mid]
            R = items[mid:]
            
            _merge_sort(L)
            _merge_sort(R)
            
            i = j = k = 0
            
            while i < len(L) and j < len(R):
                comparisons[0] += 1
                if L[i] <= R[j]:
                    items[k] = L[i]
                    i += 1
                else:
                    items[k] = R[j]
                    j += 1
                k += 1
                merge_operations[0] += 1
                
            while i < len(L):
                items[k] = L[i]
                i += 1
                k += 1
                merge_operations[0] += 1
                
            while j < len(R):
                items[k] = R[j]
                j += 1
                k += 1
                merge_operations[0] += 1
                
    _merge_sort(arr)
    return arr, comparisons[0], merge_operations[0]
