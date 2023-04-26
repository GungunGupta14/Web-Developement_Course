
import './App.css';
import { useEffect, useState } from 'react';


function App() {
  
  const [text, setText] = useState('');
  //const [name, setname] = useState('love');

  //variation 1 -> useEffect is a hook that is called after every render
  // useEffect( () => {
  //   console.log('useEffect called');
  // });

  //variation 2 -> first render
  // useEffect( () => {
  //   console.log('useEffect called');
  // }, []);

  //variation 3 ->first render +  whenever dependency changes
  // useEffect( () => {
  //   console.log("change observed");
  // }, [name]);

  //variation 4 -> to handle unmounting of a component
  useEffect( () => {
    //add event listener
    console.log('listener added')

    return() => {
      //remove event listener
      console.log('listener removed')
    }
  },[text]);

  function changeHandler(event){
    setText(event.target.value);
    console.log(text);
  }



  return (
    <div className="App">
      <input type="text" placeholder="Enter your name" onChange={changeHandler} />
    </div>
  );
}

export default App;