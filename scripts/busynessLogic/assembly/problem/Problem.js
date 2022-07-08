import { AssemblyGrid } from '../AssemblyGrid'

export class Problem {
	initialMatrix
	finalMatrix
	problemSteps = []
	templateId

	constructor({assemblyDescriptor, initialProblemStepIndex = undefined}) {
		const { problemSteps } = this
		const { routes } = assemblyDescriptor
		const randomRouteIndex = Math.trunc(Math.random() * routes.length)
		const route = routes[randomRouteIndex]
		const assemblyGrid = new AssemblyGrid()

		this.finalMatrix = assemblyDescriptor.matrix
		assemblyGrid.setMatrix(assemblyDescriptor.matrix)

		for(let i = 0; i <= (initialProblemStepIndex * 3 ?? route.length -1); i += 3) {
			/* converting original format of slide actions descriptors from
			0 = slide up
			1 = slide down
			2 = slide left
			3 = slide right
			to
			0 = horisontal slide
			1 = vertical slide
			*/
			const actionDescriptor = {
				slideTypeId: Number(route[i]),
				entryIndex: Number(route[i + 1]),
				delta: Number(route[i + 2]),
			}

			switch(actionDescriptor.slideTypeId) {
				case 0:
					actionDescriptor.slideTypeId = 1
					actionDescriptor.delta *= -1
					break
				case 1: break
					actionDescriptor.slideTypeId = 1
					break
				case 2:
					actionDescriptor.slideTypeId = 0
					actionDescriptor.delta *= -1
					break
				case 3:
					actionDescriptor.slideTypeId = 0
					break
			}

			assemblyGrid.slide(actionDescriptor)

			problemSteps.push({
				matrix: structuredClone(assemblyGrid.matrix),
				actionDescriptor
			})
		}

		this.initialMatrix = problemSteps.at(-1).matrix
	}

	//problem generation is too complex task for browser, therefore it is not remastered and not ported to JS
	//https://github.com/PetrViitman/RobotsFactory/blob/main/Assets/Scripts/MVC/model/gameplay/assembly/problem/GProblemModel.cs
	/*
	public GProblemModel(int[][] aFinalIdsMap_int_arr_arr, int aIterationsNumber_int, GSolverModel aSolver_gsm)
		: base()
	{
		this.states_gpsmp = new GProblemStateModelPool(GProblemModel.MAXIMAL_STATES_NUMBER);
		this.finalIdsMap_int_arr_arr = aFinalIdsMap_int_arr_arr;

		GGridModel gridModel_ggm = new GGridModel(aFinalIdsMap_int_arr_arr);
		GProblemStateModelPool states_gpsmp = this.states_gpsmp;

		int calculationLength_int = 0;

		while(states_gpsmp.length() < aIterationsNumber_int)
		{	
			if(states_gpsmp.isEmpty())
			{
				gridModel_ggm.adjust(aFinalIdsMap_int_arr_arr);
			}
			else
			{
				gridModel_ggm.adjust(states_gpsmp.getLastState().getIdsMap());
			}

			int[] randomAction_int_arr = this.generateRandomAction();

			gridModel_ggm.applyAction(
					randomAction_int_arr[0],
					randomAction_int_arr[1],
					randomAction_int_arr[2]);

			bool actionIsValid_bl = true;

			//CHECKING INSTANT SOLUTION...
			if(!states_gpsmp.isEmpty())
			{
				GSolutionModel solution_gsm =  aSolver_gsm.getSolution(gridModel_ggm, aFinalIdsMap_int_arr_arr);

				if(solution_gsm != null && solution_gsm.length() < states_gpsmp.length())
				{
					actionIsValid_bl = false;
				}
			}
			//...CHECKING INSTANT SOLUTION

			//CHECKING PROBLEM STEP IN SOLVABLE RANGE...
			for( int i = 1; i <= aSolver_gsm.getMaximalDifficultyLevel(); i++)
			{
				int previousStateIndex_int = states_gpsmp.length() - i;
				int solutionToPreviousStateLength_int = i;

				if(previousStateIndex_int <= 0)
				{
					continue;
				}
				
				int[][] previousIdsMap_int_arr_arr = states_gpsmp.getState(previousStateIndex_int).getIdsMap();
				
				GSolutionModel solution_gsm = aSolver_gsm.getSolution(gridModel_ggm, previousIdsMap_int_arr_arr);
				
				if(solution_gsm.length() != solutionToPreviousStateLength_int)
				{
					actionIsValid_bl = false;
					break;
				}
			}
			//...CHECKING PROBLEM STEP IN SOLVABLE RANGE

			//SKIP IF ACTION IS NOT VALID...
			if(!actionIsValid_bl)
			{
				//EXITING POSSIBLE ENDLESS LOOP...
				calculationLength_int++;
				if(calculationLength_int > GProblemModel.MAXIMAL_CALCULATION_LENGTH)
				{
					calculationLength_int = 0;
					states_gpsmp.drop();
				}
				//...EXITING POSSIBLE ENDLESS LOOP

				continue;
			}
			//...SKIP IF ACTION IS NOT VALID

			//CHECKING PROBLEM STEP IN UNSOLVABLE RANGE...
			for( int i = states_gpsmp.length() - aSolver_gsm.getMaximalDifficultyLevel() - 1; i >= 0; i--)
			{
				int[][] previousIdsMap_int_arr_arr = states_gpsmp.getState(i).getIdsMap();
				
				GSolutionModel solution_gsm = aSolver_gsm.getSolution(gridModel_ggm, previousIdsMap_int_arr_arr);

				if(
					solution_gsm != null &&
					solution_gsm.length() < i
					)
				{
					actionIsValid_bl = false;
					break;
				}
			}
			//...CHECKING PROBLEM STEP IN UNSOLVABLE RANGE
			
			//ADDING PROBLEM STATE TO POOL...
			if(actionIsValid_bl)
			{
				states_gpsmp.add(gridModel_ggm.getIdsMap(), randomAction_int_arr);
			}
			//...ADDING PROBLEM STATE TO POOL
			
			//EXITING POSSIBLE ENDLESS LOOP...
			calculationLength_int++;
			if(calculationLength_int > GProblemModel.MAXIMAL_CALCULATION_LENGTH)
			{
				calculationLength_int = 0;
				states_gpsmp.drop();
			}
			//...EXITING POSSIBLE ENDLESS LOOP
		}
		
		this.initialIdsMap_int_arr_arr = states_gpsmp.getLastState().getIdsMap();
	}


	private int[] generateRandomAction()
	{
		int[] previousAction_int_arr = null;

		if(this.states_gpsmp.length() > 0)
		{
			previousAction_int_arr = this.states_gpsmp.getState(this.states_gpsmp.length() - 1).getAction();
		}

		//ACTION TYPE ID...
		int actionTypeId_int = Random.Range(0, GGridModel.ACTION_IDS.Length);
		//...ACTION TYPE ID

		//ENTRY POINT INDEX...
		int entryPointIndex_int = Random.Range(0, 3);
		if(
			previousAction_int_arr != null &&
			previousAction_int_arr[1] == entryPointIndex_int
			)
		{
			entryPointIndex_int++;

			if(entryPointIndex_int > 2)
			{
				entryPointIndex_int = 0;
			}
		}
		//...ENTRY POINT INDEX

		//DELTA...
		int delta_int = Random.Range(1, 3);
		//...DELTA

		return new int[]{actionTypeId_int, entryPointIndex_int, delta_int};
	}
	*/

}