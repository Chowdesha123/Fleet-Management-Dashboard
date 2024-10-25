import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
 


function App() {
  const [vehicles, setVehicles] = useState([]);
  const [newVehicle, setNewVehicle] = useState({
    id: '',
    battery: 100,
    distance: 0,
    status: 'Idle',
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewVehicle((prev) => ({ ...prev, [name]: value }));
  };

  // Adding a new vehicle
  const addVehicle = () => {
    if (!newVehicle.id || newVehicle.battery < 0 || newVehicle.battery > 100) {
      alert('Please enter a valid vehicle ID and battery percentage (0-100).');
      return;
    }

    const vehicle = {
      ...newVehicle,
      id: uuidv4(),
      distance: Number(newVehicle.distance),
    };
    setVehicles([...vehicles, vehicle]);
    setNewVehicle({ id: '', battery: 100, distance: 0, status: 'Idle' });
  };

  // Updating vehicle battery status
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) => {
          if (vehicle.status === 'In Transit') {
            const newBattery = vehicle.battery - 1;
            return {
              ...vehicle,
              battery: Math.max(newBattery, 0),
              distance: vehicle.distance + 3,
            };
          } else if (vehicle.status === 'Charging') {
            const newBattery = vehicle.battery + 1;
            return { ...vehicle, battery: Math.min(newBattery, 100) };
          }
          return vehicle;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Battery Alert
  const lowBatteryAlert = (battery) => battery < 15;

  return (
    <div className="App">
      <header>
        <h1>Fleet Management Dashboard</h1>
      </header>

      {/* Add Vehicle Form */}
      <div className="add-vehicle">
        <h2>Add New Vehicle</h2>
        <input
          type="text"
          name="id"
          placeholder="Vehicle ID"
          value={newVehicle.id}
          onChange={handleChange}
        />
        <input
          type="number"
          name="battery"
          placeholder="Battery Percentage"
          value={newVehicle.battery}
          onChange={handleChange}
          min="0"
          max="100"
        />
        <input
          type="number"
          name="distance"
          placeholder="Distance Travelled (km)"
          value={newVehicle.distance}
          onChange={handleChange}
        />
        <button className="add-button" onClick={addVehicle}>
          Add Vehicle
        </button>
      </div>

      {/* Vehicle List */}
      <div className="vehicle-list">
        <h2>Vehicles</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Battery</th>
              <th>Distance</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr
                key={vehicle.id}
                className={
                  lowBatteryAlert(vehicle.battery) ? 'low-battery' : ''
                }
              >
                <td>{vehicle.id}</td>
                <td>{vehicle.battery}%</td>
                <td>{vehicle.distance} km</td>
                <td className={`status ${vehicle.status.toLowerCase()}`}>
                  {vehicle.status}
                </td>
                <td>
                  <button
                    onClick={() =>
                      setVehicles(
                        vehicles.map((v) =>
                          v.id === vehicle.id
                            ? { ...v, status: 'In Transit' }
                            : v
                        )
                      )
                    }
                  >
                    Start Transit
                  </button>
                  <button
                    onClick={() =>
                      setVehicles(
                        vehicles.map((v) =>
                          v.id === vehicle.id ? { ...v, status: 'Charging' } : v
                        )
                      )
                    }
                  >
                    Start Charging
                  </button>
                  <button
                    onClick={() =>
                      setVehicles(
                        vehicles.map((v) =>
                          v.id === vehicle.id ? { ...v, status: 'Idle' } : v
                        )
                      )
                    }
                  >
                    Set Idle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
