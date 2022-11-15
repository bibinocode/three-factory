import City from "./mesh/city";
import scene from './scene'
let city
export default function createMesh () {
  city = new City(scene)
}


export function updateMesh (time) {

}