# Implementation of a spreadsheet using topological sort
> with formulas referencing other cells, eg. `#A3*10`

see example here : https://yannick42.github.io/dsa-tests/

# Snake game in JS
> https://yannick42.github.io/dsa-tests/snake/

it reuses the toposort algorithm (DFS in `/common/`) to order neuron calculations (TODO)

@TODO
- be able to run a game without canvas visualization
- see timings
- add weight to DAG
- add 1 or 2 activation functions when calculing output
- display action decided by NN
- add Genetic Algorithms to select a group of fittest NNs, and mutate/crossover them for next population generation (the weight values only for now)
- add a slider to modify canvas game speed
