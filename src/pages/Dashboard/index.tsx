import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food, { FoodData } from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

function Dashboard() {
  const [foods, setFoods] = useState<FoodData[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingFood, setEditingFood] = useState<FoodData>()

  useEffect(() => {
    api.get('/foods')
    .then(response => setFoods(response.data))
    
  }, [])

  async function handleAddFood(food: FoodData) {
    try {
      api.post('/foods', {
        ...foods,
        avaiable: true
      })
      .then(response => setFoods([...foods, response.data]))
    } catch (err) {
      console.log(err)
    }
  }


  async function handleUpdateFood(food: FoodData) {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood?.id}`, {
        ...editingFood,
        ...food
      })

      const foodsUpdated = foods.map(f => 
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      )

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err)
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`)

    const foodsFiltered = foods.filter(food => food.id !== id)
    setFoods(foodsFiltered)
  }

  function toggleModal() {
    setModalOpen(!modalOpen)
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen)
  }

  function handleEditFood(food: FoodData) {
    setEditModalOpen(!editModalOpen)
    setEditingFood(food)
  }


    return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    );
}


export default Dashboard;
